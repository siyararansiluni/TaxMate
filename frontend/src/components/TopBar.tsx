interface TopBarProps {
  page: string
  year?: string
  initial?: string
  onMenuClick?: () => void // opens the sidebar drawer (below lg only)
}

function TopBar({ page, year = '2025 / 2026', initial = 'K', onMenuClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-md p-2 text-[#173453] hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" className="h-5 w-5" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p className="truncate text-[11px] text-slate-500">
          TaxMate / <span className="font-medium text-slate-700">{page}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] text-slate-600">{year}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          {initial}
        </span>
      </div>
    </header>
  )
}

export default TopBar