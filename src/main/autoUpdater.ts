import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'

export const setupAutoUpdater = () => {
  autoUpdater.on('update-available', (info) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: `A new version (${info.version}) is available. Do you want to download it now?`,
        buttons: ['Yes', 'No']
      })
      .then((result) => {
        if (result.response === 0) autoUpdater.downloadUpdate()
      })
  })

  autoUpdater.on('update-downloaded', (info) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: `Version ${info.version} has been downloaded and will be installed on restart. Restart now?`,
        buttons: ['Restart', 'Later']
      })
      .then((result) => {
        if (result.response === 0) {
          app.isQuitting = true
          if (global.tray) global.tray.destroy()
          autoUpdater.quitAndInstall()
        }
      })
  })

  return {
    checkForUpdates: () => {
      if (!app.isPackaged) {
        autoUpdater.updateConfigPath = join(__dirname, '../../dev-app-update.yml')
      }

      autoUpdater.checkForUpdates()
    }
  }
}
