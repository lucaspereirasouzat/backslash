import { useEffect, useState } from 'react'

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from '@renderer/elements/Command'

import { Popover, PopoverContent, PopoverTrigger } from '@renderer/elements/Popover'
import { winElectron } from '@renderer/lib/utils'

export const SubCommand = ({ actions, pluginName, commandName, result, inputRef }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'g' && e.ctrlKey) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleActionSelect = async (actionName: string) => {
    await winElectron.runPluginAction(pluginName, commandName, actionName, result)
    winElectron.hideMainWindow()
    setOpen(false)
  }

  const handlePopoverClose = (e: Event) => {
    e.preventDefault()
    inputRef?.current?.focus()
  }

  if (actions.length === 0) return null

  return (
    <>
      {open && <BlurOverlay />}

      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger onClick={() => setOpen(true)} aria-expanded={open}>
          <span className="flex items-center gap-2 text-xs">
            More
            <div className="flex items-center gap-0.5">
              <CommandShortcut>^</CommandShortcut>
              <CommandShortcut>G</CommandShortcut>
            </div>
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="border border-zinc-800 rounded-md relative z-20"
          side="top"
          align="end"
          onCloseAutoFocus={handlePopoverClose}
          sideOffset={16}
          alignOffset={0}
        >
          <Command loop>
            <CommandList>
              <CommandGroup heading="Actions">
                {actions.map((action) => (
                  <SubItem key={action.name} onSelect={() => handleActionSelect(action.name)}>
                    {action.name}
                  </SubItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandInput placeholder="Search for actions..." />
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

const SubItem = ({ children, onSelect }) => (
  <CommandItem className="flex items-center justify-between" onSelect={onSelect}>
    {children}
  </CommandItem>
)

const BlurOverlay = () => <div className="fixed inset-0 bg-black/60 z-10"></div>
