/**
 * Utility function to strip HTML tags from a string cleanly.
 * Replaces closing block element tags and br tags with spaces to prevent words from sticking together,
 * strips all other HTML tags, decodes common HTML entities, and collapses multiple spaces.
 */
export const stripHtml = (htmlString: string): string => {
  if (!htmlString) return '';
  
  // Replace block element tags with spaces to avoid words joining together
  let text = htmlString.replace(/<\/(p|h1|h2|h3|h4|h5|h6|div|li|blockquote|section|article)>/gi, ' ');
  
  // Replace br tags with spaces
  text = text.replace(/<br\s*\/?>/gi, ' ');
  
  // Strip all other HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Replace HTML entities
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
  };
  text = text.replace(/&nbsp;|&lt;|&gt;|&amp;|&quot;|&#39;/g, (match) => entities[match] || match);
  
  // Collapse whitespace and trim
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * Extracts a professional preview snippet from HTML content.
 * It ignores heading tags (h1-h6) because they repeat the article title,
 * and extracts text from paragraphs and other body elements.
 */
export const getPreviewText = (htmlString: string): string => {
  if (!htmlString) return '';

  // If it doesn't look like HTML, just return it trimmed
  if (!/<[a-z][\s\S]*>/i.test(htmlString)) {
    return htmlString.trim();
  }

  // Remove heading elements and their contents
  const cleanHtml = htmlString.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, ' ');

  // Strip remaining HTML tags and clean up whitespace
  return stripHtml(cleanHtml);
};

