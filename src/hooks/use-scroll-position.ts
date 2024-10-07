import type { MutableRefObject, RefObject } from 'react'
import { useEffect, useState } from 'react'
import { useEventListener } from '@/hooks/use-event-listener'
import { useMounted } from '@/hooks/use-mounted'

export type Ref = RefObject<Element> | MutableRefObject<Element>

export interface ScrollPosition {
  scrollDirection: 'up' | 'right' | 'down' | 'left'
  scrollEdgeX?: 'left' | 'right'
  scrollEdgeY?: 'top' | 'bottom'
  scrollX: number
  scrollY: number
}

export interface ScrollPositionOptions {
  /**
   * The number of pixels from the edge of the window to trigger the
   * scrollEdgeX and scrollEdgeY properties.
   */
  edgeThreshold?: number
  /**
   * The delay in milliseconds to debounce the event. If omitted, the event
   * handler will not be debounced.
   */
  debounceDelay?: number
}

export interface UseScrollPosition {
  /**
   * Use a scroll position.
   *
   * Overload 1: Ref omitted, scroll position tracking added to window.
   *
   * @param options The options.
   * @example const scrollPosition = useScrollPosition(options)
   */
  (options?: ScrollPositionOptions): ScrollPosition

  /**
   * Use a scroll position.
   *
   * Overload 2: Ref included, scroll position tracking added to ref's current.
   *
   * @param ref The ref associated with the target element to listen to.
   * @param options The options.
   * @example
   * const ref = useRef<HTMLDivElement>(null)
   * const scrollPosition = useScrollPosition(ref, options)
   */
  (ref: Ref, options?: ScrollPositionOptions): ScrollPosition
}

export const useScrollPosition: UseScrollPosition = (
  arg1?: ScrollPositionOptions | Ref,
  arg2?: ScrollPositionOptions
) => {
  const [prevScrollX, setPrevScrollX] = useState(0)
  const [prevScrollY, setPrevScrollY] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] =
    useState<ScrollPosition['scrollDirection']>('down')
  const [scrollEdgeX, setScrollEdgeX] =
    useState<ScrollPosition['scrollEdgeX']>('left')
  const [scrollEdgeY, setScrollEdgeY] =
    useState<ScrollPosition['scrollEdgeY']>('top')

  let eventTarget: Window | Element | null
  let scrollTargetIsBody: boolean
  let options: ScrollPositionOptions

  const isMounted = useMounted()
  const refOmitted = !arg1 || !('current' in arg1)

  if (refOmitted) {
    // eslint-disable-next-line unicorn/no-null
    eventTarget = isMounted ? window : null
    scrollTargetIsBody = true
    options = arg1 || {}
  } else {
    eventTarget = arg1.current
    scrollTargetIsBody = false
    options = arg2 || {}
  }

  const { edgeThreshold = 10, debounceDelay = 0 } = options

  function onScroll(event: Event): void {
    const scrollTarget = event.target as Element

    if (!scrollTarget) {
      return
    }

    const newScrollX = scrollTargetIsBody
      ? window.scrollX
      : scrollTarget.scrollLeft

    const newScrollY = scrollTargetIsBody
      ? window.scrollY
      : scrollTarget.scrollTop

    setScrollX(newScrollX)
    setScrollY(newScrollY)

    const { scrollHeight, clientHeight, scrollWidth, clientWidth } =
      scrollTarget

    const isAtLeft = newScrollX <= edgeThreshold
    const isAtRight = scrollTargetIsBody
      ? window.innerWidth + newScrollX >=
        document.body.offsetWidth - edgeThreshold
      : newScrollX >= scrollWidth - clientWidth - edgeThreshold

    const isAtTop = newScrollY <= edgeThreshold
    const isAtBottom = scrollTargetIsBody
      ? window.innerHeight + newScrollY >=
        document.body.offsetHeight - edgeThreshold
      : newScrollY >= scrollHeight - clientHeight - edgeThreshold

    if (isAtLeft) {
      setScrollEdgeX('left')
    }

    if (isAtRight) {
      setScrollEdgeX('right')
    }

    if (!isAtLeft && !isAtRight) {
      setScrollEdgeX(undefined)
    }

    if (isAtTop) {
      setScrollEdgeY('top')
    }

    if (isAtBottom) {
      setScrollEdgeY('bottom')
    }

    if (!isAtTop && !isAtBottom) {
      setScrollEdgeY(undefined)
    }
  }

  useEventListener(eventTarget, 'scroll', onScroll, {
    debounceDelay,
    passive: true
  })

  useEffect(() => {
    if (scrollX < prevScrollX) {
      setScrollDirection('left')
    }

    if (scrollX > prevScrollX) {
      setScrollDirection('right')
    }

    setPrevScrollX(scrollX)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollX])

  useEffect(() => {
    if (scrollY < prevScrollY) {
      setScrollDirection('up')
    }

    if (scrollY > prevScrollY) {
      setScrollDirection('down')
    }

    setPrevScrollY(scrollY)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY])

  return {
    scrollDirection,
    scrollEdgeX,
    scrollEdgeY,
    scrollX,
    scrollY
  }
}
