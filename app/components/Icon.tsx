import type { SVGProps } from "react";

const paths = {
  message: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z",
  folder: "M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
  mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm-1 2 9 6 9-6",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16",
  layers: "m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  cpu: "M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm2 4h4v4h-4Z",
  monitor: "M4 3h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 18h8m-4-4v4",
  briefcase: "M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M4 6h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-1 6a20 20 0 0 0 18 0m-9-1v3",
  shield: "m12 3 9 4v5c0 5-9 10-9 10S3 17 3 12V7l9-4Zm-4 9 3 3 5-6",
  search: "M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.3-2.2L22 22",
  palette: "M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.4-3.4 1 1 0 0 1 .7-1.7H17a4 4 0 0 0 4-4 9 9 0 0 0-9-8ZM7 10h.01M10 7h.01M15 7h.01M17 11h.01",
  login: "M15 3h5v18h-5M3 12h11m-4-4 4 4-4 4",
} as const;
export type IconName = keyof typeof paths;
export function Icon({name,className="",...props}:{name:IconName}&SVGProps<SVGSVGElement>){return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={`fc-icon ${className}`} {...props}><path d={paths[name]}/></svg>}
