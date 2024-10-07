import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

export interface IntersectionObserverOptions {
  /**
   * The element that is used as the viewport for checking visibility of the
   * target. Must be the ancestor of the target.
   */
  root?: IntersectionObserverInit['root']
  /**
   * A margin around the element within which the intersection will be
   * considered. Negative values are allowed.
   */
  rootMargin?: IntersectionObserverInit['rootMargin']
  /**
   * An array of values between 0 and 1 that determine at what percentage of
   * the element's visibility the observer's callback should be executed.
   */
  threshold?: IntersectionObserverInit['threshold']
}

export interface UseInViewOptions extends IntersectionObserverOptions {
  /**
   * Allows the returned boolean to remain true when the element is scrolled
   * past.
   */
  oneWay?: boolean
}

export interface UseInViewResult {
  inView: boolean
  hasBeenInView: boolean
}

/**
 * Used to determine if an element is in view with an [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver).
 *
 * @template T The type of the element to observe.
 * @param {RefObject<T>} ref The ref to the element to observe.
 * @param {UseInViewOptions} options The options for the IntersectionObserver.
 * @returns {UseInViewResult} An object indicating if the element is in view
 *  and whether it has been in view once.
 */
export function useInView<T extends HTMLElement>(
  ref: RefObject<T>,
  options: UseInViewOptions = {
    root: undefined,
    rootMargin: '0px 0px 0px 0px',
    threshold: [1],
    oneWay: true
  }
): UseInViewResult {
  const { root, rootMargin, threshold, oneWay } = options
  const [inView, setInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)

  useEffect(() => {
    const observerOptions = {
      root,
      rootMargin,
      threshold
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        const isScrolledPast = !!oneWay && entry.boundingClientRect.top < 0
        setInView(entry.isIntersecting || isScrolledPast)

        if (entry.isIntersecting) {
          setHasBeenInView(true)
        }
      }
    }, observerOptions)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref, root, rootMargin, threshold, oneWay])

  return { inView, hasBeenInView }
}
