import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession, getSession } from '../auth/session'

interface TopBarProps {
  page: string
  year?: string
  initial?: string
  onMenuClick?: () => void // opens the sidebar drawer (below lg only)
}

const ACCOUNT_LABELS: Record<string, string> = {
  TAXPAYER: 'Taxpayer Account',
  ADVISOR: 'Tax Advisor Account',
  ADMIN: 'Administrator Account',
}

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
    {children}
  </svg>
)

function TopBar({ page, year = '2025 / 2026', initial = 'K', onMenuClick }: TopBarProps) {
  const navigate = useNavigate()
  const session = getSession()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const name = session?.name ?? 'Guest'
  const accountLabel = session ? ACCOUNT_LABELS[session.role] : ''

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return

    const onClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleViewProfile = () => {
    setOpen(false)
    navigate('/profile')
  }

  const handleLogout = () => {
    setOpen(false)
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    // relative z-20 so the dropdown floats above the page content
    <header className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
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

        {/* Profile dropdown */}
        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Open profile menu"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 transition hover:ring-2 hover:ring-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {initial}
          </button>

          {open && (
            <div
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
            >
              {/* user info */}
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#173453]">{name}</p>
                  <p className="truncate text-xs text-slate-500">{accountLabel}</p>
                </div>
              </div>

              {/* actions */}
              <div className="p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleViewProfile}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#173453] transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <span className="text-blue-600">
                    <Icon>
                      <circle cx="9" cy="7" r="3.5" />
                      <path d="M3 20v-1a5 5 0 015-5h2" />
                      <path d="M15 20l1-4 5-5a1.4 1.4 0 012 2l-5 5z" />
                    </Icon>
                  </span>
                  View Profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#173453] transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  <span className="text-red-600">
                    <Icon>
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <path d="M16 17l5-5-5-5M21 12H9" />
                    </Icon>
                  </span>
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar