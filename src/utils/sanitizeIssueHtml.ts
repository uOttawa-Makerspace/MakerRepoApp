import DOMPurify from "dompurify";

/**
 * Printer-issue descriptions are rich text from the Trix editor (bold, italic, strike, lists,
 * quotes, code, line breaks, headings). Nothing else is needed, so only those formatting tags
 * survive. Deliberately absent: <style> (CSS injection / UI redressing), <a> (links are not
 * needed to read an issue, and would need rel/target handling), <img>, <form>, <svg>, etc.
 * No attributes at all are kept (no style, class, href, on*). Disallowed tags are unwrapped, so
 * their text stays; <style> and <script> are dropped with their content.
 */
const ALLOWED_TAGS = [
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "del",
  "br",
  "p",
  "div",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "h1",
];

export const sanitizeIssueHtml = (html: string): string =>
  DOMPurify.sanitize(html ?? "", { ALLOWED_TAGS, ALLOWED_ATTR: [] });
