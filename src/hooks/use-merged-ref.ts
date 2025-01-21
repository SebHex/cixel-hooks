import type { Ref, RefObject } from 'react'
import { useImperativeHandle, useRef } from 'react'

/**
 * Merges a forwarded ref with a local ref. Useful for accessing a forwarded
 * ref within a component.
 *
 * @template T The type of the ref.
 * @param {Ref<T | null> | undefined} forwardedRef The forwarded ref.
 * @returns {RefObject<T | null>} The merged ref.
 */
export function useMergedRef<T>(
  forwardedRef: Ref<T | null> | undefined
): RefObject<T | null> {
  const mergedRef = useRef<T>(null)
  useImperativeHandle(forwardedRef, () => mergedRef.current!)

  return mergedRef
}
