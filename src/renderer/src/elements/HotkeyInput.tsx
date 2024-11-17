import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@renderer/elements/Button'
import { Input } from '@renderer/elements/Input'
import { Label } from '@renderer/elements/Label'
import { winElectron } from '@renderer/lib/utils'

interface HotkeyInputProps {
  label: string
  type: string
}

export const HotkeyInput = ({ label, type }: HotkeyInputProps) => {
  const [hotkey, setHotkey] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const recordHotkey = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const modifiers: string[] = []

    if (e.ctrlKey) modifiers.push('Ctrl')
    if (e.altKey) modifiers.push('Alt')
    if (e.shiftKey) modifiers.push('Shift')
    if (e.metaKey) modifiers.push('Meta')

    let key = e.key
    if (key === ' ') key = 'Space'

    if (key === 'Escape') {
      stopRecording()
      return
    }

    if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
      const newHotkey = [...modifiers, key].join('+')
      setHotkey(newHotkey)
      stopRecording()
    } else {
      setHotkey(modifiers.join('+'))
    }
  }, [])

  const startRecording = useCallback(() => {
    setIsRecording(true)
    setHotkey('')
    winElectron.ipcRenderer.send('disable-global-shortcuts')
    document.addEventListener('keydown', recordHotkey, { capture: true })
    inputRef.current?.focus()
  }, [recordHotkey])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    document.removeEventListener('keydown', recordHotkey, { capture: true })
    winElectron.ipcRenderer.send('enable-global-shortcuts')
  }, [recordHotkey])

  useEffect(() => {
    return () => stopRecording()
  }, [stopRecording])

  useEffect(() => {
    const fetchHotkey = async () => {
      try {
        const hk = await winElectron.getHotkeys()

        setHotkey(hk[type])
      } catch (error) {
        setHotkey('')
      }
    }

    fetchHotkey()
  }, [])

  useEffect(() => {
    if (!isRecording && hotkey) winElectron.setHotkey(type, hotkey)
  }, [isRecording])

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="hotkey">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id="hotkey"
          ref={inputRef}
          readOnly
          value={hotkey}
          placeholder="Press button to record hotkey"
          onKeyDown={(e) => e.preventDefault()}
        />
        <Button
          className="text-white"
          onClick={startRecording}
          disabled={isRecording}
          variant="outline"
        >
          {isRecording ? 'Recording...' : 'Record'}
        </Button>
      </div>
    </div>
  )
}
