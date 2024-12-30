import type { Ref, RefObject } from 'react'
import { useImperativeHandle, useRef } from 'react'

/**
 * Merges a forwarded ref with a local ref. Useful for accessing a forwarded
 * ref within a component.
 *
 * @template T The type of the ref.
 * @param {Ref<T>} forwardedRef The forwarded ref.
 * @returns {RefObject<T>} The merged ref.
 */
export function useMergedRef<T>(
  forwardedRef: Ref<T | null>
): RefObject<T | null> {
  const localRef = useRef<T>(null)
  useImperativeHandle(forwardedRef, () => localRef.current!)

  return localRef
}
