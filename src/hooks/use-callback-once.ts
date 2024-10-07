import { useCallback } from 'react'

/**
 * Use a memoized callback only once with [useCallback](https://react.dev/reference/react/useCallback).
 *
 * @template T The callback function type.
 * @param {T} callback A callback function.
 * @returns {T} The memoized callback function.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function useCallbackOnce<T extends Function>(callback: T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, [])
}
