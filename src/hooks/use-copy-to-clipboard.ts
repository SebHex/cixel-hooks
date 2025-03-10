import { useRef, useState } from 'react'

export interface UseCopyToClipboardResult {
  copy: (text: string) => Promise<boolean>
  copiedText: string | undefined
  copied: boolean
}

/**
 * Use to copy text to the clipboard with the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).
 *
 * @param {number} copiedDuration The duration in milliseconds to show the
 *  copied state. Default is 2000ms.
 * @returns {UseCopyToClipboardResult} The copy function, the copied text and
 *  the copied state.
 */
export function useCopyToClipboard(
  copiedDuration: number = 2000
): UseCopyToClipboardResult {
  const [copiedText, setCopiedText] = useState<string>()
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  async function secureCopy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.error(error)
      setCopiedText(undefined)
      return false
    }
  }

  function unsecureCopy(text: string): true {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    setCopiedText(text)
    return true
  }

  async function copy(text: string): Promise<boolean> {
    const secureCopyAvailable = window.isSecureContext && navigator.clipboard
    let result: boolean

    if (secureCopyAvailable) {
      result = await secureCopy(text)
    } else {
      result = unsecureCopy(text)
    }

    if (result) {
      setCopied(true)
      clearTimeout(copiedTimeoutRef.current)
      copiedTimeoutRef.current = setTimeout(
        () => setCopied(false),
        copiedDuration
      )
    }

    return result
  }

  return { copy, copiedText, copied }
}
