import packageInfo from '../../../../package.json'

export const Logo = () => {
  const version = packageInfo.version

  return (
    <div className="font-contrail text-sm text-white select-none">
      <span className="font-bold">\ </span>backslash
      {version && <span className="ml-2 text-xs text-gray-400">v{version}</span>}
    </div>
  )
}
