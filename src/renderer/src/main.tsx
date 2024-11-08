import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '@renderer/App'
import { ThemeProvider } from '@renderer/elements/ThemeProvider'

import './assets/base.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
