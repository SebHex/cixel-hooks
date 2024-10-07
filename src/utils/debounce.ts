/**
 * Debounces a function. The function will only be called after the given delay
 * has elapsed since the last time the debounced function was called.
 *
 * @template T The debounced function type.
 * @param {T} debouncedFunction The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {(...args: Parameters<T>) => void} A debounced version of the
 *  given function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: Array<any>) => void>(
  debouncedFunction: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debouncedFunction(...args)
      timeoutId = undefined
    }, delay)
  }
}
