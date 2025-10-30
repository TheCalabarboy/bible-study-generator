const bibleBooks = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalm',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Songs',
  'Song of Solomon',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation'
];

const bookPattern = bibleBooks
  .slice()
  .sort((a, b) => b.length - a.length)
  .map((book) => book.replace(/\s+/g, '\\s+'))
  .join('|');

// Matches: Book 1:2, Book 1:2-3, Book 1:2–3, Book 1:2-3,5
const scriptureRegex = new RegExp(
  `\\b(${bookPattern})\\s+\\d{1,3}(?::\\d{1,3}(?:[-–]\\d{1,3})?)?(?:\\s?[–-]\\s?\\d{1,3}(?::\\d{1,3})?)?(?:,\\s?\\d{1,3}(?::\\d{1,3})?)*`,
  'gi'
);

export function linkScriptureReferences(markdown = '', version = 'NKJV') {
  if (!markdown) return markdown;

  return markdown.replace(scriptureRegex, (match, _book, offset, original) => {
    // Avoid double-linking if already inside a markdown link.
    const preceding = original.slice(Math.max(0, offset - 1), offset);
    const following = original.slice(offset + match.length, offset + match.length + 1);
    if (preceding === '[' || following === ']') {
      return match;
    }

    const cleaned = match.replace(/\s+/g, ' ').trim();
    const href = buildScriptureUrl(cleaned, version);

    return `<a href="${href}" data-scripture-link="true">${cleaned}</a>`;
  });
}

export function buildScriptureUrl(reference, version = 'NKJV') {
  if (!reference) return '#';
  const normalized = reference.replace(/\s+/g, ' ').trim().replace(/\u2013/g, '-');
  const encodedReference = encodeURIComponent(normalized);
  return `https://www.biblegateway.com/passage/?search=${encodedReference}&version=${encodeURIComponent(
    version
  )}`;
}
