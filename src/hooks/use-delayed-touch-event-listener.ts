import { type RefObject, useRef } from 'react'
import { useEventListener } from '@/hooks/use-event-listener'

type TouchEventType = 'touchstart' | 'touchend'
type EventTarget = globalThis.EventTarget
type TouchEvent = globalThis.TouchEvent

/**
 * Use a touch event listener that is only triggered if the touch event is not
 * part of a scroll gesture. This is useful for handling touch events that
 * should not be triggered when scrolling.
 *
 * @param {EventTarget | null} ref The ref to attach the event listener to.
 * @param {TouchEventType} type The type of touch event to listen to.
 * @param {(event: TouchEvent) => void} handler The event handler to call when
 *  the touch event is not part of a scroll gesture.
 * @param {number} touchDelay The delay in milliseconds to wait before calling
 *  the handler.
 */
export function useDelayedTouchEventListener(
  ref: RefObject<EventTarget | null>,
  type: TouchEventType,
  handler: (event: TouchEvent) => void,
  touchDelay: number = 80
): void {
  const isTouchMoving = useRef(false)
  const touchStartEvent = useRef<TouchEvent>(undefined)
  const touchEndEvent = useRef<TouchEvent>(undefined)
  const touchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  function resetState(): void {
    isTouchMoving.current = false
    touchStartEvent.current = undefined
    touchEndEvent.current = undefined
    clearTimeout(touchTimeout.current)
  }

  useEventListener(
    ref,
    'touchstart',
    (event) => {
      if (type === 'touchstart') {
        isTouchMoving.current = false
        touchStartEvent.current = event
        touchTimeout.current = setTimeout(() => {
          if (!isTouchMoving.current && touchStartEvent.current) {
            handler(touchStartEvent.current)
          }
        }, touchDelay)
      } else {
        isTouchMoving.current = false
        clearTimeout(touchTimeout.current)
      }
    },
    { passive: true }
  )

  useEventListener(
    ref,
    'touchmove',
    () => {
      isTouchMoving.current = true
      clearTimeout(touchTimeout.current)
    },
    { passive: true }
  )

  useEventListener(
    ref,
    'touchend',
    (event) => {
      if (type === 'touchend') {
        touchEndEvent.current = event
        touchTimeout.current = setTimeout(() => {
          if (!isTouchMoving.current && touchEndEvent.current) {
            handler(touchEndEvent.current)
          }
        }, touchDelay)
      }
      resetState()
    },
    { passive: true }
  )

  useEventListener(ref, 'touchcancel', resetState, { passive: true })
}
