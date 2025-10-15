import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';

export async function exportStudyToWord(studyContent, dayNumber, title) {
  const lines = studyContent.split('\n');
  const children = [];
  const numberingConfigs = [];

  let numberingSequence = 0;
  let currentNumberingRef = null;

  const resetNumbering = () => {
    currentNumberingRef = null;
  };

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

  // Add title
  pushParagraph(
    new Paragraph({
      text: `Day ${dayNumber}: ${title}`,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      resetNumbering();
      return;
    }

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

    if (/^\*\*(.+)\*\*:?$/.test(trimmed)) {
      resetNumbering();
      const text = trimmed.replace(/\*\*/g, '');
      pushParagraph(
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 100, after: 60 },
        })
      );
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s*/, '');
      const reference = ensureNumberingRef();
      pushParagraph(
        new Paragraph({
          text: content,
          numbering: {
            reference,
            level: 0,
          },
          spacing: { before: 60, after: 60 },
        })
      );
      return;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      resetNumbering();
      const text = trimmed.replace(/^[-*•]\s*/, '');
      pushParagraph(
        new Paragraph({
          children: [new TextRun({ text })],
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
        })
      );
      return;
    }

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

    resetNumbering();
    pushParagraph(
      new Paragraph({
        text: trimmed,
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
  saveAs(blob, `day-${dayNumber}-study.docx`);
}
