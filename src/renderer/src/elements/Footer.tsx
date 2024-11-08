import { Logo } from '@renderer/elements/Logo'

export const Footer = ({ children }) => (
  <footer className="flex items-center justify-between border-t border-zinc-800 px-2 py-1.5">
    <Logo />
    <div className="text-sm text-white select-none">{children}</div>
  </footer>
)
