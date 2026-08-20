/** business name -> URL-safe base, e.g. "Royal Wear" -> "royal-wear". A short random
    suffix is appended by the caller on collision, since two different owners can
    plausibly name their business the same thing. */
export function slugify(businessName: string): string {
  const base = businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return base || 'site'
}

export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}
