import { useEffect, useState } from 'react'
import { assertValue } from '@/utils/assert-value'

export type Screens = Record<string, string>

export type PresetWithMax = `max-${string}`

export type PresetRange = `${string}:max-${string}`

function queryIsSinglePreset(
  query: string,
  screens?: Screens
): query is string {
  return !!screens?.hasOwnProperty(query)
}

function queryIsPresetWithMax(query: string): query is PresetWithMax {
  return /^max-\w+$/.test(query)
}

function queryIsPresetRange(query: string): query is PresetRange {
  return /^\w+:max-\w+$/.test(query)
}

function getQuery(queryOrPreset: string, screens?: Screens): string {
  const isSinglePreset = queryIsSinglePreset(queryOrPreset, screens)
  const isPresetWithMax = queryIsPresetWithMax(queryOrPreset)
  const isPresetRange = queryIsPresetRange(queryOrPreset)
  const isPreset = isSinglePreset || isPresetWithMax || isPresetRange
  let query = queryOrPreset

  if (screens && isPreset) {
    const [prefix, suffix] = queryOrPreset.split(':')

    if (isSinglePreset) {
      const presetName = queryOrPreset
      const minBreakpoint = assertValue(
        screens[queryOrPreset],
        `The breakpoint "${presetName}" does not exist in the screens.`
      )

      query = `(min-width: ${minBreakpoint})`
    }

    if (isPresetWithMax) {
      const presetName = queryOrPreset.replace('max-', '')
      const maxBreakpoint = assertValue(
        screens[presetName],
        `The breakpoint "${presetName}" does not exist in the screens.`
      )

      query = `(max-width: ${maxBreakpoint})`
    }

    if (isPresetRange && prefix && suffix) {
      const minBreakpoint = assertValue(
        screens[prefix],
        `The breakpoint "${prefix}" does not exist in the screens.`
      )

      const maxPresetName = suffix.replace('max-', '')
      const maxBreakpoint = assertValue(
        screens[maxPresetName],
        `The breakpoint for the ${maxPresetName} preset does not exist in the screens.`
      )

      query = `(min-width: ${minBreakpoint}) and (max-width: ${maxBreakpoint})`
    }
  }

  return query
}

function getMatches(query: string): boolean {
  const windowExists = typeof window !== 'undefined'
  return windowExists && window.matchMedia(query).matches
}

const defaultScreens: Screens = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem'
}

/**
 * Use a media query to determine if the viewport matches the query.
 *
 * @param {string} queryOrPreset A media query string such as
 *  `(min-width: 600px)` or a preset such as `md`, `max-md`, or `sm:max-md`.
 * @param {Screens} screens The breakpoints to use for presets.
 * @returns {boolean} Whether the viewport matches the query.
 */
export function useMediaQuery(
  queryOrPreset: string,
  screens: Screens = defaultScreens
): boolean {
  const query = getQuery(queryOrPreset, screens)
  const [matches, setMatches] = useState(getMatches(query))

  function updateMatches(): void {
    setMatches(getMatches(query))
  }

  useEffect(() => {
    updateMatches()

    const matchMedia = window.matchMedia(query)
    addMediaQueryListener(matchMedia, updateMatches)

    return () => {
      removeMediaQueryListener(matchMedia, updateMatches)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return matches
}

function addMediaQueryListener(
  matchMedia: MediaQueryList,
  onChange: (event: MediaQueryListEvent) => void
): void {
  if (matchMedia.addListener) {
    matchMedia.addListener(onChange)
  } else {
    matchMedia.addEventListener('change', onChange)
  }
}

function removeMediaQueryListener(
  matchMedia: MediaQueryList,
  onChange: (event: MediaQueryListEvent) => void
): void {
  if (matchMedia.removeListener) {
    matchMedia.removeListener(onChange)
  } else {
    matchMedia.removeEventListener('change', onChange)
  }
}
