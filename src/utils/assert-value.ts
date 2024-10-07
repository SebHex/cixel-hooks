/**
 * Asserts that a value exists.
 *
 * @template T The type of the value.
 * @param {T | undefined} value The value to assert.
 * @param {string} errorMessage The error message to throw.
 * @returns {T} The value if it exists.
 */
export function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (!value) {
    throw new Error(errorMessage)
  }

  return value
}
