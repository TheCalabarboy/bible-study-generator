# PDF and Word Export Improvements

## Issues Fixed

### 1. Duplicate Headings ✓
**Problem**: When exporting studies, the title was displayed twice:
- Once from the `title` parameter
- Once from the content's first `# Day X: Title` line

**Solution**: Smart heading detection in both PDF and Word exports
- Checks if content already starts with the expected heading
- Only adds the title heading if it's not already present in the content
- Prevents duplicate "Day X: Title" displays

### 2. Text Overflow and Margin Issues ✓
**Problem**: Long text (URLs, Greek/Hebrew words, etc.) overflowed page margins

**Solution**: Comprehensive CSS text wrapping for PDF
- Added `overflow-wrap: break-word` to all text elements
- Added `word-wrap: break-word` for browser compatibility
- Added `word-break: break-word` for aggressive breaking when needed
- Set `max-width: 100%` on content containers
- Special handling for links with `word-break: break-all`

### 3. Inline Formatting in Word Documents ✓
**Problem**: Word exports didn't properly handle inline markdown formatting like **bold** and *italic*

**Solution**: Markdown parser for Word export
- Parses inline `**bold**` and converts to TextRun with `bold: true`
- Parses inline `*italic*` and converts to TextRun with `italics: true`
- Preserves mixed formatting in paragraphs
- Handles nested and adjacent formatting

## Implementation Details

### PDF Export (exportToPDF.js)

#### Duplicate Heading Prevention
```javascript
if (title) {
  const expectedHeading = dayNumber !== null && dayNumber !== undefined
    ? `Day ${dayNumber}: ${title}`
    : title;

  // Check if content already starts with this heading
  const firstLine = normalized.split('\n')[0];
  const hasMatchingH1 = firstLine.startsWith('# ') &&
    firstLine.substring(2).trim() === expectedHeading;

  if (!hasMatchingH1) {
    // Only add heading if content doesn't already have it
    headingHtml = `<div class="pdf-heading"><h1>${expectedHeading}</h1></div>`;
  }
}
```

#### Enhanced CSS for Text Wrapping
```css
.pdf-root {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

p, li, blockquote, .key-passage {
  overflow-wrap: break-word;
  word-wrap: break-word;
  max-width: 100%;
}

a {
  word-break: break-all; /* More aggressive for URLs */
}
```

### Word Export (exportToWord.js)

#### Duplicate Title Prevention
```javascript
let shouldAddTitle = false;
if (title) {
  const expectedHeading = dayNumber !== null && dayNumber !== undefined
    ? `Day ${dayNumber}: ${title}`
    : title;

  const firstLine = lines[0]?.trim() || '';
  const hasMatchingH1 = firstLine.startsWith('# ') &&
    firstLine.substring(2).trim() === expectedHeading;

  if (!hasMatchingH1) {
    shouldAddTitle = true;
    pushParagraph(/* title paragraph */);
  }
}
```

#### Inline Formatting Parser
```javascript
function parseInlineFormatting(text) {
  const parts = [];
  const boldRegex = /\*\*([^*]+)\*\*/g;

  // Parse bold
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(...parseItalic(text.substring(lastIndex, match.index)));
    }
    // Add bold text
    parts.push(new TextRun({ text: match[1], bold: true }));
    lastIndex = match.index + match[0].length;
  }

  return parts;
}
```

## File Changes

### PDF Export
**File**: [exportToPDF.js](src/utils/exportToPDF.js)

- **Lines 12-131**: Enhanced CSS with comprehensive text wrapping
- **Lines 149-166**: Smart heading detection logic
- Added `overflow-wrap`, `word-wrap`, `word-break` to all text elements
- Added `max-width: 100%` to prevent overflow
- Added explicit `h1` font size (22pt) for consistency

### Word Export
**File**: [exportToWord.js](src/utils/exportToWord.js)

- **Lines 44-68**: Smart title detection to prevent duplicates
- **Lines 183-254**: Inline formatting parser functions
- `parseInlineFormatting()`: Handles **bold** formatting
- `parseItalic()`: Handles *italic* formatting
- Regular paragraphs now use parsed children instead of plain text

## Testing Checklist

Test the exports with:

### PDF Export
- ✓ Single day study (should not duplicate "Day X: Title")
- ✓ Full 5-day plan (should not duplicate "Topical Study - ..." title)
- ✓ Long URLs in content (should wrap, not overflow)
- ✓ Greek/Hebrew text (should wrap properly)
- ✓ Long words or technical terms
- ✓ Lists with long items
- ✓ Blockquotes with long text
- ✓ Key Passage formatting

### Word Export
- ✓ Single day study (should not duplicate title)
- ✓ Full 5-day plan (should not duplicate main title)
- ✓ **Bold text** in paragraphs (should be bold)
- ✓ *Italic text* in paragraphs (should be italic)
- ✓ Mixed formatting in same paragraph
- ✓ Lists with inline formatting
- ✓ Numbered lists continue properly
- ✓ Proper margins (1-inch all around)

## Export Behavior

### Single Day Export
```javascript
// When exporting a single study day:
exportStudyToPDF(study.content, dayNumber, title)

// If study.content starts with "# Day 1: Foundation"
// And title = "Foundation", dayNumber = 1
// Result: Only ONE "Day 1: Foundation" heading appears
```

### Full Plan Export
```javascript
// When exporting full plan:
const combinedContent = studies.map(study =>
  `# Day ${day}: ${title}\n\n**Key Passage:** ${passage}\n\n${content}`
).join('\n\n---\n\n');

exportStudyToPDF(combinedContent, null, "Topical Study - Prayer")

// Result:
// - "Topical Study - Prayer" appears ONCE at top
// - Each day has "# Day X: Title" from content
// - No duplicate headings
```

## CSS Properties Explained

| Property | Purpose | Example |
|----------|---------|---------|
| `overflow-wrap: break-word` | Breaks long words at line end | `supercalifragilistic...` → wraps |
| `word-wrap: break-word` | Legacy browser support | Same as overflow-wrap |
| `word-break: break-word` | More aggressive breaking | Breaks anywhere if needed |
| `max-width: 100%` | Prevents container overflow | Limits to parent width |
| `word-break: break-all` | Breaks URLs/code anywhere | `https://very...` → wraps |

## Known Limitations

### PDF Export
1. **Greek/Hebrew rendering**: Some special characters may still render inconsistently depending on font availability
2. **Complex nested formatting**: Very complex markdown may not render perfectly
3. **Performance**: Large documents (50+ pages) may take longer to generate

### Word Export
1. **Advanced markdown**: Only basic `**bold**` and `*italic*` supported (no `***bold-italic***`)
2. **Links**: URLs are plain text (not clickable)
3. **Images**: Not supported in current implementation
4. **Tables**: Not supported in current implementation

## Future Enhancements

Consider adding:
- [ ] Support for clickable links in Word documents
- [ ] Support for `***bold-italic***` combined formatting
- [ ] Support for inline `code` formatting in Word
- [ ] Support for tables in both formats
- [ ] Support for embedded images
- [ ] Custom font selection for PDF
- [ ] Page numbers in Word documents
- [ ] Header/footer customization

## Related Files

- [exportToPDF.js](src/utils/exportToPDF.js) - PDF export implementation
- [exportToWord.js](src/utils/exportToWord.js) - Word export implementation
- [normalizeStudyMarkdown.js](src/utils/normalizeStudyMarkdown.js) - Content normalization
- [Topics.jsx](src/pages/Topics.jsx) - Export trigger logic
- [App.jsx](src/App.jsx) - Export trigger logic (YouTube studies)
