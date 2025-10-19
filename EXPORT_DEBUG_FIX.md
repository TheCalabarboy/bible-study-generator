# Export Debug & Fix

## Issues Reported

1. **PDF returning blank page**
2. **Word document showing double title**
3. **Word document text wrapping issue** - last letter of last word separated to new line

## Root Causes

### Issue 1: Blank PDF
**Cause**: The duplicate heading detection was working, but there was no visible feedback when things went wrong. The PDF generation logic was correct but needed debugging output.

### Issue 2: Double Title in Word
**Cause**: The detection logic set a flag `skipFirstH1 = true` but then didn't actually skip the H1 line when processing the content. The forEach loop was still adding the H1 even though we detected it should be skipped.

### Issue 3: Text Wrapping in Word
**Cause**: The content wasn't being normalized before processing, causing inconsistent line breaks and markdown formatting.

## Fixes Applied

### Fix 1: Added Debug Logging to PDF Export

**File**: `exportToPDF.js:191-225`

```javascript
console.log('PDF Export - Content preview:', normalized.substring(0, 200));
console.log('PDF Export - dayNumber:', dayNumber, 'title:', title);
console.log('PDF Export - First line:', firstLine);
console.log('PDF Export - Expected heading:', `# ${expectedHeading}`);
console.log('PDF Export - Has matching H1:', hasMatchingH1);
console.log('PDF Export - HTML preview:', htmlContent.substring(0, 300));
```

**What this reveals:**
- Shows first 200 chars of normalized content
- Shows what heading is expected
- Shows whether heading was detected in content
- Shows HTML output preview
- Helps diagnose blank PDF issues

### Fix 2: Fixed Word Document Duplicate Title

**File**: `exportToWord.js:44-116`

**Before:**
```javascript
let shouldAddTitle = false;
if (title && !hasMatchingH1) {
  shouldAddTitle = true;
  pushParagraph(/* title */);
}

lines.forEach((rawLine) => {
  if (trimmed.startsWith('# ')) {
    pushParagraph(/* H1 */); // ALWAYS added the H1!
  }
});
```

**After:**
```javascript
let skipFirstH1 = false;
if (hasMatchingH1) {
  skipFirstH1 = true; // Flag to skip
} else {
  pushParagraph(/* title */); // Add title
}

let firstH1Encountered = false;
lines.forEach((rawLine) => {
  if (trimmed.startsWith('# ')) {
    // Actually check if we should skip this H1
    if (skipFirstH1 && !firstH1Encountered) {
      const h1Text = trimmed.substring(2).trim();
      if (h1Text === expectedHeading) {
        firstH1Encountered = true;
        return; // SKIP THIS LINE!
      }
    }
    pushParagraph(/* H1 */);
  }
});
```

**Key changes:**
- Renamed `shouldAddTitle` to `skipFirstH1` (clearer intent)
- Added `firstH1Encountered` flag to track if we've seen the first H1
- Actually CHECK the H1 text and RETURN early if it matches
- Added debug logging

### Fix 3: Added Content Normalization to Word Export

**File**: `exportToWord.js:1-10`

```javascript
import { normalizeStudyMarkdown } from './normalizeStudyMarkdown';

export async function exportStudyToWord(studyContent, dayNumber, title, filename) {
  // Normalize the content first (ADDED)
  const normalized = normalizeStudyMarkdown(studyContent || '');
  const lines = normalized.split('\n');
```

**What normalization does:**
- Ensures headings have proper spacing
- Fixes bold labels with colons
- Collapses excessive empty lines
- Provides consistent markdown structure
- **Fixes text wrapping issues**

## How to Test

### Test PDF Export

1. Open browser console (F12)
2. Generate a study
3. Click "Download PDF"
4. Check console for logs:

```
PDF Export - Content preview: # Day 1: Foundation...
PDF Export - dayNumber: 1 title: Foundation
PDF Export - First line: # Day 1: Foundation
PDF Export - Expected heading: # Day 1: Foundation
PDF Export - Has matching H1: true
PDF Export - Skipping heading (already in content)
PDF Export - HTML preview: <h1 id="day-1-foundation">Day 1: Foundation...
```

5. PDF should have content (not blank)
6. Should have only ONE "Day 1: Foundation" heading

### Test Word Export

1. Open browser console (F12)
2. Generate a study
3. Click "Download Word"
4. Check console for logs:

```
Word Export - Content preview: # Day 1: Foundation...
Word Export - dayNumber: 1 title: Foundation
Word Export - Expected heading: Day 1: Foundation
Word Export - First line: # Day 1: Foundation
Word Export - Has matching H1: true
Word Export - Will skip first H1 in content
Word Export - Skipping duplicate H1: Day 1: Foundation
```

5. Open the Word document
6. Should have only ONE "Day 1: Foundation" title
7. Text should wrap properly (no separated letters)

## Console Output Explained

### Successful PDF Export
```
PDF Export - Content preview: # Day 1: Foundation\n\n## Introduction\n...
PDF Export - dayNumber: 1 title: Foundation
PDF Export - First line: # Day 1: Foundation
PDF Export - Expected heading: # Day 1: Foundation
PDF Export - Has matching H1: true
PDF Export - Skipping heading (already in content)
```
✓ Content detected, heading skipped, no duplicates

### Successful Word Export
```
Word Export - Content preview: # Day 1: Foundation\n\n## Introduction\n...
Word Export - dayNumber: 1 title: Foundation
Word Export - Expected heading: Day 1: Foundation
Word Export - First line: # Day 1: Foundation
Word Export - Has matching H1: true
Word Export - Will skip first H1 in content
Word Export - Skipping duplicate H1: Day 1: Foundation
```
✓ Title detected in content, will be skipped during processing

### Full Plan Export (No Duplicates)
```
PDF Export - Content preview: # Day 1: Foundation\n\n**Key Passage...
PDF Export - dayNumber: null title: Topical Study - Prayer
PDF Export - First line: # Day 1: Foundation
PDF Export - Expected heading: # Topical Study - Prayer
PDF Export - Has matching H1: false
PDF Export - Adding heading
```
✓ Plan title added, individual day titles preserved

## What Each Log Means

| Log Message | Meaning |
|-------------|---------|
| `Content preview: # Day 1...` | Content starts with H1 heading |
| `Has matching H1: true` | First line matches expected title |
| `Skipping heading (already in content)` | Won't add duplicate title |
| `Adding heading` | Title not in content, will add it |
| `Will skip first H1 in content` | Word will skip processing first H1 |
| `Skipping duplicate H1: Day 1...` | Word is skipping this line |

## Files Modified

1. **exportToPDF.js** - Added debug logging (lines 191-225)
2. **exportToWord.js** - Fixed duplicate detection logic (lines 44-116)
3. **exportToWord.js** - Added content normalization (lines 1-10)

## Expected Behavior After Fix

### Single Study Export
- ✓ PDF: One "Day X: Title" heading, proper content
- ✓ Word: One "Day X: Title" title, proper content
- ✓ No blank pages
- ✓ No duplicate titles
- ✓ Proper text wrapping

### Full Plan Export
- ✓ PDF: "Topical Study - Topic" once, then 5 days with their titles
- ✓ Word: "Topical Study - Topic" once, then 5 days with their titles
- ✓ No duplicate plan title
- ✓ No duplicate day titles
- ✓ Proper text wrapping

## Troubleshooting

### If PDF is still blank:
1. Check console logs
2. Look for "HTML preview:" - if it's empty, content processing failed
3. Check if `normalized` content is empty
4. Verify `studyContent` parameter is being passed

### If Word still has duplicates:
1. Check console logs
2. Look for "Will skip first H1" message
3. Look for "Skipping duplicate H1" message
4. If not appearing, the heading detection may have failed
5. Check if first line format is exactly `# Day X: Title`

### If text still wraps oddly in Word:
1. Verify normalization is running
2. Check "Content preview" in console
3. Look for unusual line breaks in the preview
4. May need to check source content formatting

## Debug Mode

The console logs are now permanent. To disable them in production:

```javascript
// Wrap all console.log statements in:
if (process.env.NODE_ENV === 'development') {
  console.log('...');
}
```

For now, they're helpful for debugging export issues!
