import { useEffect, useState } from 'react'
import { FolderCode, Keyboard, SettingsIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '@renderer/elements/Sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/elements/Tooltip'
import { Button } from '@renderer/elements/Button'
import { Label } from '@renderer/elements/Label'
import { Input } from '@renderer/elements/Input'
import { Alert } from '@renderer/elements/Alert'
import { HotkeyInput } from '@renderer/elements/HotkeyInput'
import { Dialog, DialogContent, DialogTrigger } from '@renderer/elements/Dialog'
import { winElectron } from '@renderer/lib/utils'

const NAV = [
  { id: 'hotkeys', name: 'Hotkeys', icon: Keyboard },
  { id: 'plugins', name: 'Plugins', icon: FolderCode }
]

export const Settings = () => {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('hotkeys')
  const [pluginsDir, setPluginsDir] = useState<string | null>(null)

  useEffect(() => {
    const fetchPluginsDir = async () => {
      try {
        const dir = await winElectron.getPluginsDir()
        setPluginsDir(dir)
      } catch (error) {
        setPluginsDir(null)
      }
    }

    fetchPluginsDir()

    winElectron.ipcRenderer.send('enable-global-shortcuts')
  }, [open])

  const handleChoosePluginsDir = async () => {
    const newDir = await winElectron.choosePluginsDir()
    if (newDir) setPluginsDir(newDir)
  }

  const handleOpenChange = async (state: boolean) => {
    setOpen(state)
    if (!state) await winElectron.reloadApp()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon" variant="outline">
                <SettingsIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 h-5/6 w-5/6">
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {NAV.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={item.id === activeTab}>
                          <a onClick={() => setActiveTab(item.id)}>
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-8">
              {activeTab === 'hotkeys' && (
                <>
                  <HotkeyInput label="Toggle app visibility" type="toggle-app" />

                  <HotkeyInput label="Toggle more actions" type="more-actions" />
                </>
              )}

              {activeTab === 'plugins' && (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="pluginsDir">Plugins directory</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      className="cursor-default"
                      id="pluginsDir"
                      onClick={handleChoosePluginsDir}
                      placeholder="Click here to select a directory"
                      spellCheck={false}
                      value={pluginsDir || ''}
                    />
                  </div>
                </div>
              )}

              <Alert>Close the settings window to apply changes.</Alert>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
