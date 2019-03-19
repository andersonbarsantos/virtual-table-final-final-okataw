/** Cached result of whether the user's browser supports scroll behaviors. */
let scrollSupport = true;

/**
 * Check whether the browser supports scroll behaviors.
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
 */
export function supportsSmoothScroll(): boolean {
  if (scrollSupport == null && typeof window !== 'undefined') {
    try {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    } catch {
      scrollSupport = false;
    }
  }

  return scrollSupport;
}
