import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';

export async function exportStudyToWord(studyContent, dayNumber, title) {
  const lines = studyContent.split('\n');
  const children = [];
  
  // Add title
  children.push(
    new Paragraph({
      text: `Day ${dayNumber}: ${title}`,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );
  
  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      // Main heading
      children.push(
        new Paragraph({
          text: line.replace('# ', ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    }
    else if (line.startsWith('## ')) {
      // Subheading
      children.push(
        new Paragraph({
          text: line.replace('## ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );
    }
    else if (line.startsWith('### ')) {
      // Small heading
      children.push(
        new Paragraph({
          text: line.replace('### ', ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 160, after: 80 },
        })
      );
    }
    else if (line.match(/^\*\*(.+)\*\*:?$/)) {
      // Bold text
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.replace(/\*\*/g, ''),
              bold: true,
              size: 24,
            })
          ],
          spacing: { before: 100, after: 60 },
        })
      );
    }
    else if (line.match(/^\d+\./)) {
      // Numbered list
      children.push(
        new Paragraph({
          text: line,
          numbering: {
            reference: 'number-numbering',
            level: 0,
          },
          spacing: { before: 60, after: 60 },
        })
      );
    }
    else if (line.startsWith('-') || line.startsWith('•')) {
      // Bullet points
      const text = line.replace(/^[-•]\s*/, '');
      children.push(
        new Paragraph({
          text: text,
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
        })
      );
    }
    else if (line.startsWith('---')) {
      // Separator
      children.push(
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
    }
    else if (line.trim() !== '') {
      // Regular paragraph
      children.push(
        new Paragraph({
          text: line,
          spacing: { before: 80, after: 80 },
        })
      );
    }
  });
  
  // Create document
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'number-numbering',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
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
        children: children,
      },
    ],
  });
  
  // Generate and save
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `day-${dayNumber}-study.docx`);
}