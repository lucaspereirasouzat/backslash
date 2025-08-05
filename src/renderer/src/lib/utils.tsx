import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Badge } from '@renderer/elements/Badge'

export const elementTypes = {
  DIV: 'div',
  SPAN: 'span',
  P: 'p',
  TITLE: 'title',
  UL: 'ul',
  LI: 'li',
  BADGE: 'badge',
  IMG: 'img',
  ICON: 'icon',
  LABEL: 'label',
  CODE: 'code',
  BLOCKQUOTE: 'blockquote',
  HR: 'hr'
}

export const BANGS: BangT[] = [
  {
    bang: 'yt',
    name: 'YouTube',
    url: 'https://www.youtube.com'
  },
  {
    bang: 'g',
    name: 'Google',
    url: 'https://www.google.com'
  },
  {
    bang: 'gi',
    name: 'Google Images',
    url: 'https://www.google.com/images'
  },
  {
    bang: 'gm',
    name: 'Google Maps',
    url: 'https://www.google.com/maps'
  },
  {
    bang: 'w',
    name: 'Wikipedia',
    url: 'https://fr.wikipedia.org'
  },
  {
    bang: 't',
    name: 'Google Translate',
    url: 'https://translate.google.com'
  },
  {
    bang: 'am',
    name: 'Amazon',
    url: 'https://www.amazon.fr'
  },
  {
    bang: 'gh',
    name: 'GitHub',
    url: 'https://github.com'
  },
  {
    bang: 'd',
    name: 'Larousse',
    url: 'https://www.larousse.'
  },
  {
    bang: 'im',
    name: 'IMDb',
    url: 'https://www.imdb.com'
  }
]

/**
 * A global flag indicating whether the renderer is running under Electron.
 */
export const winElectron = window.electron

/**
 * A utility function to merge class names.
 *
 * @param inputs - A list of class values to merge.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Truncates a query string to a maximum length.
 *
 * @param query - The query string.
 * @param maxLength - The maximum length.
 * @returns The truncated query string.
 */
const truncateQuery = (query: string, maxLength = 30) => {
  if (query.length <= maxLength) return query
  return query.slice(0, maxLength) + '...'
}

/**
 * Renders an element from a plain object representation.
 *
 * @param element - The element object.
 * @param index - An index for the element.
 * @returns The rendered element.
 */
export const renderElement = (element, index) => {
  switch (element.type) {
    case elementTypes.BADGE:
      return (
        <Badge key={index} variant="secondary" className={element.className}>
          {element.content}
        </Badge>
      )

    case elementTypes.TITLE:
      return (
        <span key={index} className={element.className}>
          {element.content}
        </span>
      )

    case elementTypes.IMG:
      return (
        <img
          key={index}
          src={element.props.src}
          alt={element.props.alt}
          className={element.className}
        />
      )

    case elementTypes.ICON:
      return <i key={index} className={element.className} />

    case elementTypes.CODE:
      return (
        <code key={index} className={`bg-gray-100 px-1 rounded ${element.className}`}>
          {element.content}
        </code>
      )

    case elementTypes.BLOCKQUOTE:
      return (
        <blockquote
          key={index}
          className={`border-l-4 border-gray-300 pl-4 italic ${element.className}`}
        >
          {element.content}
        </blockquote>
      )

    case elementTypes.HR:
      return <hr key={index} className={`my-2 ${element.className}`} />

    case elementTypes.P:
      return (
        <span key={index} className={`text-xs text-zinc-500 ${element.className}`}>
          {element.content}
        </span>
      )

    case elementTypes.DIV:
    case elementTypes.SPAN:
    case elementTypes.UL:
    case elementTypes.LI:
    case elementTypes.LABEL:
      const Component = element.type

      return (
        <Component key={index} className={element.className} {...element.props}>
          {element.content}
          {element?.children?.map((child, childIndex) =>
            renderElement(child, `${index}-${childIndex}`)
          )}
        </Component>
      )

    default:
      return <span key={index}>Unknown element type: {element.type}</span>
  }
}

const getBang = (bang: string): BangT | undefined => {
  return BANGS.find((b) => b.bang === bang)
}

/**
 * An array of shortcuts.
 *
 * Each shortcut is an object with the following properties:
 *
 * - `name`: The name of the shortcut.
 * - `label`: A function that takes the current query and returns a JSX element
 *   that will be rendered as the label for the shortcut.
 * - `icon`: A string representing the name of a Phosphor icon.
 * - `bgColor`: A string representing the background color of the shortcut.
 * - `color`: A string representing the text color of the shortcut.
 * - `getUrl`: A function that takes the current query and returns the URL
 *   that the shortcut should open.
 */
export const SHORTCUTS: ShortcutT[] = [
  {
    name: 'sc-youtube-search',
    bang: getBang('yt'),
    label: (query: string) => (
      <>
        Search {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        on YouTube
      </>
    ),
    icon: 'youtube-logo',
    bgColor: '#FF0000',
    color: '#FFFFFF',
    getUrl: (query: string) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  },
  {
    name: 'sc-google-search',
    bang: getBang('g'),
    label: (query: string) => (
      <>
        Search {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        on Google
      </>
    ),
    icon: 'magnifying-glass',
    bgColor: '#4285F4',
    color: '#FFFFFF',
    getUrl: (query: string) => `https://www.google.com/search?q=${encodeURIComponent(query)}`
  },
  {
    name: 'sc-image-search',
    bang: getBang('gi'),
    label: (query: string) => (
      <>
        Search {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        on Google Images
      </>
    ),
    icon: 'image-square',
    bgColor: '#4285F4',
    color: '#FFFFFF',
    getUrl: (query: string) =>
      `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`
  },
  {
    name: 'sc-google-maps',
    bang: getBang('gm'),
    label: (query: string) => (
      <>
        Search {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        on Google Maps
      </>
    ),
    icon: 'map-pin',
    bgColor: '#4285F4',
    color: '#FFFFFF',
    getUrl: (query: string) => `https://www.google.com/maps/search/${encodeURIComponent(query)}`
  },
  {
    name: 'sc-wikipedia',
    bang: getBang('w'),
    label: (query: string) => (
      <>
        Search {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        on Wikipedia
      </>
    ),
    icon: 'books',
    bgColor: '#000000',
    color: '#FFFFFF',
    getUrl: (query: string) =>
      `https://fr.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`
  },
  {
    name: 'sc-translate',
    bang: getBang('t'),
    label: (query: string) => (
      <>
        Translate {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        on Google Translate
      </>
    ),
    icon: 'translate',
    bgColor: '#4285F4',
    color: '#FFFFFF',
    getUrl: (query: string) => `https://translate.google.com/?text=${encodeURIComponent(query)}`
  },
  {
    name: 'sc-amazon',
    bang: getBang('am'),
    label: (query: string) => (
      <>
        Search {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        on Amazon
      </>
    ),
    icon: 'basket',
    bgColor: '#FF9900',
    color: '#000000',
    getUrl: (query: string) => `https://www.amazon.fr/s?k=${encodeURIComponent(query)}`
  },
  {
    name: 'sc-github',
    bang: getBang('gh'),
    label: (query: string) => (
      <>
        Search {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        on GitHub
      </>
    ),
    icon: 'github-logo',
    bgColor: '#24292e',
    color: '#FFFFFF',
    getUrl: (query: string) => `https://github.com/search?q=${encodeURIComponent(query)}`
  },
  {
    name: 'sc-dictionary',
    bang: getBang('d'),
    label: (query: string) => (
      <>
        Define {query && <span className="text-zinc-400 italic">{truncateQuery(query)} </span>}
        in Larousse
      </>
    ),
    icon: 'chat-teardrop-text',
    bgColor: '#293368',
    color: '#FFFFFF',
    getUrl: (query: string) =>
      `https://www.larousse.fr/dictionnaires/francais/${encodeURIComponent(query)}`
  },
  {
    name: 'sc-imdb',
    bang: getBang('im'),
    label: (query: string) => (
      <>
        Find {query && <span className="text-zinc-400 italic">{truncateQuery(query)}</span>}
        {query ? ' on IMDb' : 'movies/TV shows on IMDb'}
      </>
    ),
    icon: 'popcorn',
    bgColor: '#F5C518',
    color: '#000000',
    getUrl: (query: string) => `https://www.imdb.com/find?q=${encodeURIComponent(query)}`
  }
]

/**
 * Transforms a hotkey string into an array of uppercase strings.
 * @param {string} hotkey - the hotkey string
 * @returns {string[]} - an array of uppercase strings
 */
export const transformHotkey = (hotkey: string): string[] => {
  return hotkey.split('+').map((key) => key.trim().toUpperCase())
}
