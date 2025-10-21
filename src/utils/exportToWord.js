import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';

// This utility converts a Markdown-like study into a Word document. It supports
// headings, numbered lists, various bullet characters, horizontal rules, and
// lines that begin with bold text followed by normal text. It also handles
// dynamic titles: if the provided dayNumber is numeric, the title is prefixed
// with "Day X: "; otherwise the title is used as-is. The converter maintains
// numbering within a section and resets numbering whenever a blank line,
// heading or bullet is encountered.
export async function exportStudyToWord(
  studyContent = '',
  dayNumber,
  title = 'Bible Study'
) {
  // Remove any HTML anchor tags or other HTML markup that may be present in
  // the study content. Scripture references are often wrapped in <a> tags
  // (added by linkScriptureReferences) which do not render well in Word.
  // We preserve the inner text while stripping the tags. We also remove
  // any remaining HTML tags completely.
  const sanitizedContent = studyContent
    // first, convert <br> tags to newlines
    .replace(/<br\s*\/?>/gi, '\n')
    // unwrap anchor tags but keep their inner text
    .replace(/<a\s+[^>]*>(.*?)<\/a>/gi, '$1')
    // drop any other HTML tags like <em>, <strong>, etc.
    .replace(/<[^>]+>/g, '')
    // normalise line breaks
    .replace(/\r\n/g, '\n');

  const lines = sanitizedContent.split('\n');
  const children = [];
  const numberingConfigs = [];

  let numberingSequence = 0;
  let currentNumberingRef = null;

  const resetNumbering = () => {
    currentNumberingRef = null;
  };

  // Parses a line of text for **bold** and *italic* markdown and returns an
  // array of TextRun objects.
  const parseInlineFormatting = (text) => {
    const runs = [];
    // This regex will find **bold** or *italic* text, including the markers.
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add any plain text before the match.
      if (match.index > lastIndex) {
        runs.push(new TextRun(text.substring(lastIndex, match.index)));
      }

      const matchedText = match[0];
      if (matchedText.startsWith('**')) {
        // Handle bold text
        runs.push(
          new TextRun({
            text: matchedText.slice(2, -2),
            bold: true,
          })
        );
      } else {
        // Handle italic text
        runs.push(
          new TextRun({ text: matchedText.slice(1, -1), italics: true })
        );
      }
      lastIndex = regex.lastIndex;
    }

    // Add any remaining plain text after the last match.
    if (lastIndex < text.length) {
      runs.push(new TextRun(text.substring(lastIndex)));
    }

    return runs.length > 0 ? runs : [new TextRun(text)];
  };

  // Ensure there is a current numbering reference for numbered lists. Each
  // sequence gets its own reference so multiple lists can be tracked
  // independently.
  const ensureNumberingRef = () => {
    if (!currentNumberingRef) {
      numberingSequence += 1;
      currentNumberingRef = `number-list-${numberingSequence}`;
      numberingConfigs.push({
        reference: currentNumberingRef,
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 },
              },
            },
          },
        ],
      });
    }
    return currentNumberingRef;
  };

  const pushParagraph = (paragraph) => {
    children.push(paragraph);
  };

  // Determine the document title. If dayNumber is numeric, prefix with "Day X: ".
  const isNumericDay = Number.isFinite(Number(dayNumber));
  const headingText =
    isNumericDay && dayNumber != null ? `Day ${dayNumber}: ${title}` : title;
  pushParagraph(
    new Paragraph({
      text: headingText,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // --- Duplicate Title Prevention ---
  // Check if the first line of the content is already the main title. This is
  // common when exporting a "full study" where the content is pre-formatted.
  // If it is, we'll skip processing that line to avoid a duplicate title.
  let skipFirstH1 = false;
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    const expectedH1 = `# ${headingText}`;
    if (firstLine.startsWith('# ') && firstLine.replace('# ', '').trim() === headingText) {
      skipFirstH1 = true;
    }
  }

  try {
    lines.forEach(rawLine => {
      // If we've flagged the first H1 for skipping, do it here and reset the flag.
      if (skipFirstH1 && rawLine.trim().startsWith('# ')) {
        skipFirstH1 = false; // Only skip the very first H1
        return;
      }

      const line = rawLine.trimEnd();
      const trimmed = line.trim();

      // Blank lines reset numbering and don't produce output.
      if (!trimmed) {
        resetNumbering();
        return;
      }

      // Handle top-level heading (# )
      if (trimmed.startsWith('# ')) {
        resetNumbering();
        pushParagraph(
          new Paragraph({
            text: trimmed.replace('# ', ''),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );
        return;
      }

      // Second-level heading (## )
      if (trimmed.startsWith('## ')) {
        resetNumbering();
        pushParagraph(
          new Paragraph({
            text: trimmed.replace('## ', ''),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        return;
      }

      // Third-level heading (### )
      if (trimmed.startsWith('### ')) {
        resetNumbering();
        pushParagraph(
          new Paragraph({
            text: trimmed.replace('### ', ''),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
          })
        );
        return;
      }

      // Numbered list items (e.g., "1. " or "2. text"). We accept both
      // "1." without a space or with spaces after the period. The leading
      // number and dot are removed before attaching numbering.
      if (/^\d+\.\s*/.test(trimmed)) {
        const content = trimmed.replace(/^\d+\.\s*/, '');
        const reference = ensureNumberingRef();
        pushParagraph(
          new Paragraph({
            children: parseInlineFormatting(content),
            numbering: {
              reference,
              level: 0,
            },
            spacing: { before: 60, after: 60 },
          })
        );
        return;
      }

      // Unordered list items. Accept -, *, •, – (en dash) and — (em dash) as
      // markers. We strip the marker and any whitespace after it.
      if (/^\s*[-*•–—]\s+/.test(trimmed)) {
        resetNumbering();
        const text = trimmed.replace(/^\s*[-*•–—]\s*/, '');
        pushParagraph(
          new Paragraph({
            children: parseInlineFormatting(text),
            bullet: { level: 0 },
            spacing: { before: 60, after: 60 },
          })
        );
        return;
      }

      // Horizontal rule (---) is rendered as a decorative line.
      if (trimmed.startsWith('---')) {
        resetNumbering();
        pushParagraph(
          new Paragraph({
            text: '',
            spacing: { before: 120, after: 120 },
            border: {
              bottom: {
                color: 'CCCCCC',
                space: 1,
                style: 'single',
                size: 6,
              },
            },
          })
        );
        return;
      }

      // Default: treat as a normal paragraph. Reset numbering to avoid
      // continuing any previous numbered list into plain text.
      resetNumbering();
      pushParagraph(
        new Paragraph({
          children: parseInlineFormatting(trimmed),
          spacing: { before: 80, after: 80 },
        })
      );
    });

    const docConfig = {
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children,
        },
      ],
    };

    if (numberingConfigs.length) {
      docConfig.numbering = { config: numberingConfigs };
    }

    const doc = new Document(docConfig);

    const blob = await Packer.toBlob(doc);
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename =
      isNumericDay && dayNumber != null
        ? `day_${dayNumber}_${safeTitle}.docx`
        : `${safeTitle}.docx`;
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to generate Word document:', error);
    // Optionally, notify the user with a toast or alert
  }
}