import type { SVGProps } from 'react'

const paths = {
  dome: <path d="M3 17a9 9 0 0 1 18 0z" fill="currentColor" stroke="none" />,
  menu: <path d="M3 8.5h18M3 15.5h11" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  leaf: (
    <>
      <path d="M5 19c0-8.3 5.6-14 15-14 0 9.4-5.7 15-14 15" />
      <path d="M5 19c2.8-3.9 6.3-6.9 10.2-9" />
    </>
  ),
  flame: (
    <path d="M12 3c.9 3.6 5 5.6 5 10.2a5 5 0 0 1-10 0c0-2.3 1.2-3.8 2.5-4.9.2 1.7 1 2.8 2.1 3.3C10.8 8.9 11.1 6 12 3z" />
  ),
  spatula: (
    <>
      <path d="m3.5 20.5 7-7" />
      <path d="m10.5 13.5 3.8-3.8 6.2 6.2-3.8 3.8z" />
    </>
  ),
  bell: (
    <>
      <path d="M3.5 18.5h17" />
      <path d="M5.5 18.5a6.5 6.5 0 0 1 13 0" />
      <path d="M12 12V9.5M10.3 9.5h3.4" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.4L3.5 20.4l1.4-4.1a8.5 8.5 0 1 1 15.6-4.7z" />
      <path d="M9 8.3c.3 2.8 2.6 5.3 5.7 6.2l1.3-1.4 2 .9-.5 1.7c-4 .3-8.9-3.8-9.3-7.9l1.6-.6 1 1.8z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
}

export type IconName = keyof typeof paths

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 24, ...svgProps }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...svgProps}
    >
      {paths[name]}
    </svg>
  )
}
