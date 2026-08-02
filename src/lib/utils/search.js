/**
 * Search Term Sanitization Utilities
 *
 * PostgREST's .or() method uses commas as condition separators, and ILIKE
 * patterns use % and _ as wildcards. User-provided search terms must be
 * sanitized to prevent query parsing errors and potential injection.
 */

/**
 * Sanitize a search term for safe use in PostgREST .or() query strings.
 * Escapes ILIKE wildcards and replaces commas (which are condition separators
 * in PostgREST .or() syntax with no escape mechanism).
 *
 * @param {string} term - The raw search term
 * @returns {string} Sanitized search term safe for .or() queries
 */
export function sanitizeSearchTerm(term) {
  return term
    .replace(/\\/g, '\\\\')
    .replace(/,/g, ' ')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}
