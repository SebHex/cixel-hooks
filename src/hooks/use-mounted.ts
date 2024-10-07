import { useState } from 'react'
import { useEffectOnce } from '@/hooks/use-effect-once'

/**
 * Used to determine if a component is mounted.
 *
 * @returns {boolean} A boolean indicating if the component is mounted.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffectOnce(() => setMounted(true))

  return mounted
}
