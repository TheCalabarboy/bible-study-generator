// src/utils/exportToPDF.js
import jsPDF from 'jspdf';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import html2canvas from 'html2canvas';
window.html2canvas = html2canvas;


// --- Visual theme ---
const MARGIN = 36; // 0.5in
const THEME = {
  h1: 'font-size:20px; font-weight:700; color:#667eea; margin:12px 0 8px;',
  h2: 'font-size:17px; font-weight:700; color:#764ba2; margin:10px 0 6px;',
  h3: 'font-size:14px; font-weight:700; color:#22293a; margin:8px 0 6px;',
  p:  'font-size:11px; color:#22293a; line-height:1.55; margin:6px 0;',
  li: 'font-size:11px; color:#22293a; line-height:1.55; margin:4px 0;',
  hr: 'border:0; height:1px; background:#667eea; margin:12px 0;',
  small: 'font-size:10px; color:#828282;',
  title: 'font-size:22px; font-weight:700; color:#667eea; margin:0 0 6px;',
  subtitle: 'font-size:11px; color:#764ba2; margin:0 0 10px;'
};

// Create a lightweight HTML wrapper so doc.html lays things out nicely
function wrapHtml({ title, dayNumber, passage, contentHtml }) {
  // Optional header block at the top of the PDF page
  const headerBlock = `
    <div style="margin-bottom:12px;">
      ${title ? `<div style="${THEME.title}">${dayNumber != null ? `Day ${dayNumber}: ` : ''}${title}</div>` : ''}
      ${passage ? `<div style="${THEME.subtitle}">📖 ${passage}</div>` : ''}
    </div>
    <hr style="${THEME.hr}"/>
  `;

  // Basic CSS so lists/headings/paragraphs look right
  const css = `
    <style>
      h1 { ${THEME.h1} }
      h2 { ${THEME.h2} }
      h3 { ${THEME.h3} }
      p  { ${THEME.p} }
      li { ${THEME.li} }
      ol, ul { margin: 6px 0 8px 18px; padding: 0; }
      blockquote { margin: 8px 0; padding: 8px 12px; border-left: 3px solid #e0d4f7; background:#f8f7ff; }
      code { font-family: monospace; background:#f2f2f2; padding:2px 4px; border-radius:3px; }
      hr { ${THEME.hr} }
      .page { width: 100%; }
      .header { margin-bottom: 8px; }
    </style>
  `;

  // Wrap everything; doc.html renders the body inside margins we set below
  return `
    <!doctype html>
    <html>
    <head><meta charset="utf-8" />${css}</head>
    <body>
      <div class="page">
        ${headerBlock}
        ${contentHtml}
      </div>
    </body>
    </html>
  `;
}

function addFooters(doc) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const { width, height } = doc.internal.pageSize;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(`Page ${i} of ${pageCount}`, width / 2, height - 18, { align: 'center' });
  }
}

/**
 * Export a single day's study to PDF (or a full study if you pass a big content blob).
 * @param {string} studyContent - Markdown string (what you render on the site)
 * @param {number|null} dayNumber - e.g., 1..5, or null for "full"
 * @param {string} title - Day title (optional but recommended)
 * @param {string} filename - Optional custom filename
 * @param {string} passage - Optional scripture reference shown under the title
 */
export async function exportStudyToPDF(studyContent, dayNumber, title, filename, passage = '') {
  // To re-enable this feature, uncomment the code below.
  // The call to `marked.parse()` has been updated to the modern, stable API
  // to prevent the "this.parseInline is not a function" error.
  /*
  // 1) Convert Markdown → HTML
  const rawHtml = marked.parse(studyContent ?? '', { gfm: true, breaks: true });
  const safeHtml = DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });

  // 2) Wrap in a minimal HTML page with simple CSS
  const html = wrapHtml({ title, dayNumber, passage, contentHtml: safeHtml });

  // 3) Create jsPDF and render HTML
  const doc = new jsPDF({ unit: 'pt', format: 'letter', compressPdf: true });
  await doc.html(html, {
    x: MARGIN,
    y: MARGIN,
    width: doc.internal.pageSize.getWidth() - MARGIN * 2,
    windowWidth: 800,
    autoPaging: 'text',
  });

  // 4) Add footers and save
  addFooters(doc);
  const defaultName = dayNumber != null ? `day-${dayNumber}-study.pdf` : (filename || 'full-study.pdf');
  doc.save(filename || defaultName);
  */

  // This feature is temporarily disabled due to formatting issues.
  // The underlying implementation using html2canvas via jsPDF.html() can be
  // unreliable for complex layouts and special characters. A better approach
  // might be to manually render line-by-line using jsPDF's text functions,
  // which offers more control over the final output.
  alert('The PDF export feature is temporarily disabled. We are working on improving it!');
  console.log('PDF export is currently disabled.');
}
