import type { VoidFunction } from '@/types'
import { useEffect, useRef } from 'react'

/**
 * Use an interval to run a callback.
 *
 * @param {VoidFunction} callback The callback to run.
 * @param {number} delay The delay in milliseconds.
 */
export const useInterval = (callback: VoidFunction, delay?: number): void => {
  const savedCallback = useRef<VoidFunction>()

  // Remember latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Setup interval
  useEffect(() => {
    const tick = (): void => {
      savedCallback.current?.()
    }

    if (delay !== undefined) {
      const id = setInterval(tick, delay)

      return () => {
        clearInterval(id)
      }
    }
  }, [delay])
}
