import jsPDF from 'jspdf';

export function exportStudyToPDF(studyContent, dayNumber, title) {
  const doc = new jsPDF();
  
  // Set up colors
  const primaryColor = [102, 126, 234]; // Purple
  const textColor = [51, 51, 51]; // Dark gray
  
  let yPosition = 20;
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text(`Day ${dayNumber}: ${title}`, 20, yPosition);
  yPosition += 15;
  
  // Add line separator
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Process content
  const lines = studyContent.split('\n');
  doc.setTextColor(...textColor);
  
  lines.forEach((line) => {
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Handle different markdown elements
    if (line.startsWith('# ')) {
      // Main heading
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      const text = line.replace('# ', '');
      doc.text(text, 20, yPosition);
      yPosition += 12;
    }
    else if (line.startsWith('## ')) {
      // Subheading
      yPosition += 5; // Add space before
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      const text = line.replace('## ', '');
      doc.text(text, 20, yPosition);
      yPosition += 10;
    }
    else if (line.startsWith('### ')) {
      // Small heading
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      const text = line.replace('### ', '');
      doc.text(text, 20, yPosition);
      yPosition += 8;
    }
    else if (line.match(/^\*\*(.+)\*\*:?$/)) {
      // Bold text (like "Verse:" or "Context:")
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      const text = line.replace(/\*\*/g, '');
      doc.text(text, 25, yPosition);
      yPosition += 7;
    }
    else if (line.match(/^\d+\./)) {
      // Numbered list
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      const splitText = doc.splitTextToSize(line, 165);
      doc.text(splitText, 25, yPosition);
      yPosition += splitText.length * 6 + 2;
    }
    else if (line.startsWith('-') || line.startsWith('•')) {
      // Bullet points
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      const text = line.replace(/^[-•]\s*/, '');
      const splitText = doc.splitTextToSize('• ' + text, 165);
      doc.text(splitText, 25, yPosition);
      yPosition += splitText.length * 6 + 2;
    }
    else if (line.startsWith('---')) {
      // Separator line
      yPosition += 3;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 5;
    }
    else if (line.trim() !== '') {
      // Regular paragraph text
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      const splitText = doc.splitTextToSize(line, 170);
      doc.text(splitText, 20, yPosition);
      yPosition += splitText.length * 6 + 3;
    }
    else {
      // Empty line - add small space
      yPosition += 4;
    }
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`day-${dayNumber}-study.pdf`);
}