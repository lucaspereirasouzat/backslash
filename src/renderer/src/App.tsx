import { useState, useRef, KeyboardEvent } from 'react'

import { Command, CommandInput, CommandList } from '@renderer/elements/Command'
import { CommandEmpty, CommandShortcut } from '@renderer/elements/Command'
import { Footer } from '@renderer/elements/Footer'
import { Commands } from '@renderer/components/Commands'
import { CommandPage } from '@renderer/components/CommandPage'
import { CommandApplications } from '@renderer/components/CommandApplications'
import { CommandShortcuts } from '@renderer/components/CommandShortcuts'
import { useScrollToTop } from '@renderer/hooks'
import { Settings } from '@renderer/components/Settings'
import { CommandMath } from './components/CommandMath'

const App = () => {
  const [selectedCommand, setSelectedCommand] = useState<CommandT | null>(null)
  const [commandSearch, setCommandSearch] = useState('')
  const commandListRef = useRef<HTMLDivElement | null>(null)

  useScrollToTop(commandListRef, [commandSearch])

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setCommandSearch('')
    }
  }

  const commandFilter = (value: string, search: string, keywords: string[] | undefined): number => {
    if (value && value.startsWith('sc-')) return 1
    const extendValue = keywords?.join(' ') || ''
    const words = search.toLowerCase().split(' ')
    const found = words.every((word) => extendValue.toLowerCase().includes(word))
    return found ? 1 : 0
  }

  return (
    <div className="bg-black h-full">
      {!selectedCommand && (
        <Command filter={commandFilter} loop>
          <div className="flex items-center gap-2 px-3 border-b border-zinc-800">
            <CommandInput
              autoFocus
              value={commandSearch}
              onValueChange={setCommandSearch}
              onKeyDown={handleInputKeyDown}
              placeholder="Search commands..."
            />

            <Settings />
          </div>

          <CommandList ref={commandListRef}>
            <CommandEmpty />
            <CommandMath commandSearch={commandSearch} />

            <Commands commandSearch={commandSearch} setSelectedCommand={setSelectedCommand} />
            <CommandApplications commandSearch={commandSearch} />
            <CommandShortcuts commandSearch={commandSearch} />
          </CommandList>

          <Footer>
            <span className="flex items-center gap-2 text-xs">
              Run
              <CommandShortcut>↵</CommandShortcut>
            </span>
          </Footer>
        </Command>
      )}

      {selectedCommand && (
        <CommandPage
          selectedCommand={selectedCommand}
          setSelectedCommand={setSelectedCommand}
          setCommandSearch={setCommandSearch}
        />
      )}
    </div>
  )
}

export default App
