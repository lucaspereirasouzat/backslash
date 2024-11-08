import { app, BrowserWindow, globalShortcut, ipcMain, Menu, shell, Tray } from 'electron'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

import {
  choosePluginsDir,
  getCommands,
  getPluginActions,
  listInstalledApplications,
  openApplication,
  openExternal,
  runCommand,
  runPluginAction
} from './handlers'

let mainWindow: BrowserWindow
let tray: Tray | null = null

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    frame: false,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: { preload: join(__dirname, '../preload/index.js'), sandbox: false }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  globalShortcut.register('CommandOrControl+Space', () => {
    if (mainWindow.isVisible()) mainWindow.hide()
    else mainWindow.show()
  })

  mainWindow.on('blur', () => {
    if (!is.dev) mainWindow.hide()
  })

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    await mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    await mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const createTray = () => {
  if (process.platform !== 'linux') return

  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show app',
      click: () => mainWindow.show()
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Backslash')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await createWindow()
  createTray()

  ipcMain.handle('get-commands', () => {
    return getCommands()
  })

  ipcMain.handle('list-installed-applications', async () => {
    return listInstalledApplications()
  })

  ipcMain.handle('open-application', async (_, command) => {
    return openApplication(command)
  })

  ipcMain.handle('open-external', async (_, url) => {
    return openExternal(url)
  })

  ipcMain.handle('run-command', async (_, pluginName, commandName, params) => {
    return runCommand(pluginName, commandName, params)
  })

  ipcMain.handle('get-plugin-actions', async (_, pluginName, commandName) => {
    return getPluginActions(pluginName, commandName)
  })

  ipcMain.handle('run-plugin-action', async (_, pluginName, commandName, actionName, result) => {
    return runPluginAction(pluginName, commandName, actionName, result)
  })

  ipcMain.handle('choose-plugins-dir', async () => {
    return choosePluginsDir()
  })

  ipcMain.on('hide-main-window', () => {
    if (mainWindow) mainWindow.hide()
  })

  ipcMain.on('reload-app', () => {
    if (mainWindow) mainWindow.reload()
  })

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
