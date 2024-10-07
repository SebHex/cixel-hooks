import type { VoidFunction } from '@/types'
import { useEffect, useRef } from 'react'

/**
 * Use a timeout to run a callback.
 *
 * @param {VoidFunction} callback The callback to run.
 * @param {number} delay The delay in milliseconds.
 */
export const useTimeout = (callback: VoidFunction, delay?: number): void => {
  const savedCallback = useRef<VoidFunction>()

  // Remember latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Setup timeout
  useEffect(() => {
    const tick = (): void => {
      savedCallback.current?.()
    }

    if (delay !== undefined) {
      const id = setTimeout(tick, delay)

      return () => {
        clearTimeout(id)
      }
    }
  }, [delay])
}
