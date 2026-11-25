import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App.tsx'

/** Build-time render used by the prerender plugin in vite.config.ts. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
