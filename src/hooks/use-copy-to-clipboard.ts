import { useState } from 'react'
import { useCallbackOnce } from '@/hooks/use-callback-once'

export type CopyFunction = (text: string) => Promise<boolean>

export type CopiedText = string | undefined

export type UseCopyToClipboardResult = [CopyFunction, CopiedText]

/**
 * Use to copy text to the clipboard with the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).
 *
 * @returns {UseCopyToClipboardResult} A tuple containing the copy function
 *  and the copied text. The copy function returns a promise that resolves to
 * `true` if the text was copied.
 */
export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [copiedText, setCopiedText] = useState<CopiedText>()

  const secureCopy = async (text: string): Promise<boolean> => {
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

  const unsecureCopy = (text: string): true => {
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

  const copyFunction: CopyFunction = useCallbackOnce(async (text) => {
    const secureCopyAvailable = window.isSecureContext && navigator.clipboard

    if (secureCopyAvailable) {
      return await secureCopy(text)
    } else {
      return unsecureCopy(text)
    }
  })

  return [copyFunction, copiedText]
}
