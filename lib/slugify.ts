
/**
 * Simple slug helper using `slugify`.
 * Keeps implementation isolated for easy swapping.
 */
import slugifyLib from "slugify";
export function makeSlug(title: string) {
  return slugifyLib(title, { lower: true, strict: true });
}
