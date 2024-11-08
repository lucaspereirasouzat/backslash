import { CommandGroup, CommandItem } from '@renderer/elements/Command'
import { SHORTCUTS, winElectron } from '@renderer/lib/utils'

type CommandShortcutsProps = { commandSearch: string }

export const CommandShortcuts = ({ commandSearch }: CommandShortcutsProps) => {
  const onSelect = (shortcut: ShortcutT) => {
    if (winElectron && winElectron.openExternal) {
      const url = shortcut.getUrl(commandSearch)
      winElectron.openExternal(url)
      winElectron.hideMainWindow()
    }
  }

  return (
    <CommandGroup heading="Shortcuts">
      {SHORTCUTS.map((shortcut) => (
        <CommandItem key={shortcut.name} onSelect={() => onSelect(shortcut)} value={shortcut.name}>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex gap-2 items-center">
              <div
                className="flex items-center justify-center h-5 w-5 rounded-sm"
                style={{ backgroundColor: shortcut.bgColor, color: shortcut.color }}
              >
                <i className={`ph ph-${shortcut.icon}`} />
              </div>
              <span>{shortcut.label(commandSearch)}</span>
            </div>
            <span className="text-xs text-zinc-300">Shortcut</span>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
