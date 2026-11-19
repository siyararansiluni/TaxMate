import { Link, type LinkProps } from 'react-router-dom'

type Props = Omit<LinkProps, 'className' | 'children'> & {
  children: string
  className?: string
}

export default function BackButton({ children, className = '', ...rest }: Props) {
  return (
    <Link
      {...rest}
      className={`inline-flex items-center gap-2 rounded-lg border border-blue-400 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {children}
    </Link>
  )
}