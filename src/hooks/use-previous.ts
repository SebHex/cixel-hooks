import { useEffect, useRef } from 'react'

/**
 * Use a state's previous value.
 *
 * @template T The type of the value.
 * @param {T} value The value to track.
 * @returns {T | undefined} The previous value.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
