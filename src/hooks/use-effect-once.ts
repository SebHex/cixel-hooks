import { type EffectCallback, useEffect } from 'react'

/**
 * Use an effect only once with [useEffect](https://react.dev/reference/react/useEffect).
 *
 * @param {EffectCallback} effect Imperative function that can return a
 *  cleanup function.
 */
export function useEffectOnce(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
