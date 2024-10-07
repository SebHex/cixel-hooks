import type { VoidFunction } from '@/types'
import { useState } from 'react'
import { useEffectOnce } from '@/hooks/use-effect-once'
import { useInterval } from '@/hooks/use-interval'

export type TimeUnit = 'second' | 'minute' | 'hour'

const getMsUntilNextUnit = (timeUnit: TimeUnit): number => {
  const now = new Date()

  const msUntilNextUnit = {
    second: 1000 - now.getMilliseconds(),
    minute: 60 * 1000 - now.getMilliseconds() - now.getSeconds() * 1000,
    hour:
      60 * 60 * 1000 -
      now.getMilliseconds() -
      now.getSeconds() * 1000 -
      now.getMinutes() * 60 * 1000
  }

  return msUntilNextUnit[timeUnit]
}

/**
 * Use a callback function to update the state at a given time interval.
 * For example, if you set `timeUnit` to `minute`, the callback will be called
 * at the start of every minute (9:00:00, 9:01:00, 9:02:00, etc).
 *
 * @param {TimeUnit} timeUnit The time unit to use for the interval.
 * @param {VoidFunction} callback The callback to be called at the given time
 *  interval.
 * @param {boolean} invokeImmediately Whether to invoke the callback
 *  immediately.
 * @example
 * useTimeInterval('minute', () => {
 *   console.log('This will log at the start of every minute');
 * })
 */
export const useTimeUnitInterval = (
  timeUnit: TimeUnit,
  callback: VoidFunction,
  invokeImmediately = false
): void => {
  const [delay, setDelay] = useState(getMsUntilNextUnit(timeUnit))

  useEffectOnce(() => {
    if (invokeImmediately) {
      callback()
    }
  })

  useInterval(() => {
    callback()
    setDelay(getMsUntilNextUnit(timeUnit))
  }, delay)
}
