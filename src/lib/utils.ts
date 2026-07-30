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
