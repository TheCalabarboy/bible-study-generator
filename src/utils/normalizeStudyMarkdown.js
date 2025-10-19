export function normalizeStudyMarkdown(markdown = '') {
  let output = (markdown || '').replace(/\r\n/g, '\n');

  // Ensure headings are separated by blank lines
  output = output.replace(/([^\n])(\n)(#{1,6}\s+)/g, '$1\n\n$3');
  output = output.replace(/(#{1,6}\s+[^\n]+)(?!\n\n)/g, '$1\n');

  // Ensure bold labels with colon are followed by a space
  output = output.replace(/(\*\*[^\n]+?:\*\*)(?!\s)/g, '$1 ');

  // Collapse excessive empty lines
  output = output.replace(/\n{3,}/g, '\n\n');

  return output.trim();
}
