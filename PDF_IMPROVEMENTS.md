# PDF Export Improvements

## Summary of Changes

The PDF export functionality has been significantly improved to better handle Hebrew/Greek text and provide a more professional layout.

## Key Improvements

### 1. **Unicode Font Support**
- Changed from `times` to `helvetica` font, which has better Unicode character support
- Added special handling for Hebrew (U+0590-U+05FF) and Greek (U+0370-U+03FF, U+1F00-U+1FFF) characters
- Implemented zero-width space insertion around special characters for better line breaking

### 2. **Enhanced Text Layout**
- **Improved spacing**: Text with Hebrew/Greek now uses 1.6x line spacing (vs 1.5x for regular text)
- **Better sectioning**: Added extra spacing before/after headings for visual hierarchy
- **Color-coded headings**:
  - H1: Primary purple color
  - H2: Secondary purple color
  - H3: Standard text color

### 3. **Key Passage Highlighting**
- Added special formatting for "**Key Passage:**" lines
- Displays in a subtle gray background box
- Uses purple accent color for the label

### 4. **List Formatting Improvements**
- Better indentation (16pt for bullets, 32pt for content)
- Improved spacing between list items
- Proper handling of Hebrew/Greek text within lists
- Consistent line spacing throughout

### 5. **Typography Enhancements**
- Normalized font size to 11pt for better readability
- Updated heading sizes (H1: 22pt, H2: 18pt, H3: 14pt)
- Proper handling of markdown bold markers
- Quote normalization (curly quotes → straight quotes)

### 6. **Page Layout**
- Enhanced dividers with better thickness and spacing
- Improved footer styling with gray color
- Better page break handling for all content types

## Technical Details

### Special Character Handling
The system now:
1. Detects if text contains Hebrew/Greek characters
2. Applies appropriate line spacing
3. Inserts zero-width spaces for better text wrapping
4. Removes markdown syntax that could interfere with rendering

### Font Choice
Helvetica was chosen because:
- It's a standard PDF font (no embedding required)
- Has better Unicode support than Times
- Provides clean, professional appearance
- Handles special characters more reliably

## Testing Recommendations

Test the PDF export with content containing:
- Greek words (e.g., ἀγάπη, λόγος, πίστις)
- Hebrew words (e.g., שָׁלוֹם, אֱלֹהִים, תּוֹרָה)
- Mixed content with English and original language terms
- Long lists with special characters
- Multiple heading levels
- Key passage formatting

## Known Limitations

While Helvetica handles Unicode better than Times, it may still have issues with:
- Complex Hebrew vowel points (nikkud)
- Greek diacritical marks in certain combinations
- Right-to-left text direction for Hebrew

For production use with extensive Hebrew text, consider using a custom embedded font with full RTL support.
