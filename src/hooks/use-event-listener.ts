import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { debounce } from '@/utils/debounce'

type RefOrTarget = RefObject<EventTarget | null> | EventTarget | null

type EventType =
  | keyof WindowEventMap
  | keyof DocumentEventMap
  | keyof HTMLElementEventMap

export interface EventListenerOptions extends AddEventListenerOptions {
  /**
   * The delay in milliseconds to debounce the event handler. If omitted,
   * the event handler will not be debounced.
   */
  debounceDelay?: number
}

interface UseEventListener {
  /**
   * Use an event listener.
   *
   * Overload 1: Ref or target omitted, event listener added to document.
   *
   * @param type The event type to listen to. For example, 'click'.
   * @param handler A callback to be called when the event is triggered.
   * @param options The event options. For example, `{ passive: true }`.
   * @example useEventListener('click', onClick)
   */
  <K extends keyof DocumentEventMap>(
    type: K,
    handler: (event: DocumentEventMap[K]) => void,
    options?: EventListenerOptions | boolean
  ): void

  /**
   * Use an event listener.
   *
   * Overload 2: Ref or target omitted and event type is window specific, event
   * listener added to window.
   *
   * @param type The event type to listen to. For example, 'offline'.
   * @param handler A callback to be called when the event is triggered.
   * @param options The event options. For example, `{ passive: true }`.
   * @example useEventListener('offline', onOffline)
   */
  <K extends keyof WindowEventMap>(
    type: K,
    handler: (event: WindowEventMap[K]) => void,
    options?: EventListenerOptions | boolean
  ): void

  /**
   * Use an event listener.
   *
   * Overload 3: Ref or target included, event listener added to ref's current
   * or target.
   *
   * @param refOrTarget The ref or target used to listen to the event.
   * @param type The event type to listen to. For example, 'click'.
   * @param handler A callback to be called when the event is triggered.
   * @param options The event options. For example, `{ passive: true }`.
   * @example
   * const ref = useRef<HTMLDivElement>(null)
   * useEventListener(ref, 'click', onClick)
   */
  <K extends keyof HTMLElementEventMap>(
    refOrTarget: RefOrTarget,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: EventListenerOptions | boolean
  ): void
}

/**
 * Event types that are unique to the window and not the document.
 */
const windowSpecificEvents = [
  'afterprint',
  'beforeprint',
  'beforeunload',
  'devicemotion',
  'deviceorientation',
  'orientationchange',
  'gamepadconnected',
  'gamepaddisconnected',
  'hashchange',
  'languagechange',
  'message',
  'messageerror',
  'offline',
  'online',
  'pagehide',
  'pageshow',
  'popstate',
  'rejectionhandled',
  'resize',
  'storage',
  'unhandledrejection',
  'unload'
]

interface ExtractedEventListenerArgs {
  eventType: EventType
  handler: EventListenerOrEventListenerObject
  options: EventListenerOptions | boolean
  refOrTarget: RefOrTarget
  refOrTargetOmitted: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractArgs(args: Array<any>): ExtractedEventListenerArgs {
  const refOrTargetOmitted = typeof args[0] === 'string'

  return {
    refOrTargetOmitted,
    eventType: refOrTargetOmitted ? args[0] : args[1],
    handler: refOrTargetOmitted ? args[1] : args[2],
    options: refOrTargetOmitted ? args[2] : args[3],
    refOrTarget: refOrTargetOmitted ? null : args[0]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEventListener: UseEventListener = (...args: Array<any>) => {
  const { refOrTargetOmitted, eventType, handler, options, refOrTarget } =
    extractArgs(args)
  const savedHandlerRef = useRef(handler)

  useEffect(() => {
    savedHandlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const type: EventType = eventType
    let target: EventTarget | null

    if (refOrTargetOmitted) {
      const isWindowSpecificEvent = windowSpecificEvents.includes(type)
      target = isWindowSpecificEvent ? window : document
    } else {
      if (refOrTarget && 'current' in refOrTarget) {
        target = refOrTarget.current
      } else {
        target = refOrTarget
      }
    }

    if (!target?.addEventListener) {
      return
    }

    let optionsToUse = options
    let debounceDelay = 0

    if (typeof optionsToUse === 'object') {
      const { debounceDelay: delay, ...otherOptions } = optionsToUse
      debounceDelay = delay || 0
      optionsToUse = otherOptions
    }

    function listener(event: Event): void {
      const currentHandler = savedHandlerRef.current
      if ('handleEvent' in currentHandler) {
        currentHandler.handleEvent(event)
      } else {
        currentHandler(event)
      }
    }

    const eventListener =
      debounceDelay > 0 ? debounce(listener, debounceDelay) : listener

    target.addEventListener(type, eventListener, optionsToUse)

    return () => target.removeEventListener(type, eventListener, optionsToUse)
  }, [eventType, options, refOrTarget, refOrTargetOmitted])
}
