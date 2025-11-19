/**
 * Generate URL-friendly slugs
 */

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string, suffix?: string): string {
  let slug = text
    .toLowerCase()
    .trim()
    // Remove accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^\w-]+/g, '')
    // Remove multiple hyphens
    .replace(/--+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  if (suffix) {
    slug = `${slug}-${suffix}`;
  }

  return slug;
}

/**
 * Generate a unique slug by appending a random suffix
 */
export function generateUniqueSlug(text: string): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return generateSlug(text, randomSuffix);
}
