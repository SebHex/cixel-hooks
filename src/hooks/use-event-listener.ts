import type { MutableRefObject, RefObject } from 'react'
import { useEffect } from 'react'
import { debounce } from '@/utils/debounce'

type Ref = RefObject<EventTarget> | MutableRefObject<EventTarget>

type RefOrTarget = Ref | EventTarget | null

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEventListener: UseEventListener = (...args: Array<any>) => {
  useEffect(() => {
    let refOrTarget: RefOrTarget
    let type: EventType
    let handler: EventListenerOrEventListenerObject
    let options: EventListenerOptions | boolean
    let target: EventTarget | null

    const refOrTargetOmitted = typeof args[0] === 'string'

    if (refOrTargetOmitted) {
      ;[type, handler, options] = args
      const isWindowSpecificEvent = windowSpecificEvents.includes(type)
      target = isWindowSpecificEvent ? window : document
    } else {
      ;[refOrTarget, type, handler, options] = args

      if (refOrTarget && 'current' in refOrTarget) {
        target = refOrTarget.current
      } else {
        target = refOrTarget
      }
    }

    if (!(target && target.addEventListener)) {
      return
    }

    let debounceDelay = 0

    if (typeof options === 'object') {
      const { debounceDelay: delay, ...restOptions } = options
      debounceDelay = delay || 0

      options = {
        ...restOptions,
        passive: supportsPassive() && restOptions.passive
      }
    }

    if (debounceDelay > 0) {
      if ('handleEvent' in handler) {
        const originalHandler = handler.handleEvent.bind(handler)
        handler.handleEvent = debounce(originalHandler, debounceDelay)
      } else {
        handler = debounce(handler, debounceDelay)
      }
    }

    target.addEventListener(type, handler, options)

    return () => target.removeEventListener(type, handler, options)
  }, [args])
}

function supportsPassive(globalObject: Window = window): boolean {
  let passiveSupported = false

  try {
    const options = {
      // This function will be called when the browser
      // attempts to access the passive property
      get passive() {
        passiveSupported = true
        return false
      }
    } as EventListenerOptions

    const handler = (): void => {}

    globalObject.document.addEventListener('test', handler, options)
    globalObject.document.removeEventListener('test', handler, options)
  } catch {
    passiveSupported = false
  }

  return passiveSupported
}
