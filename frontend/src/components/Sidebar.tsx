import { NavLink, useNavigate } from 'react-router-dom'
import { clearSession } from "../auth/session";

interface SidebarProps {
  open?: boolean // drawer state on phones/tablets
  onClose?: () => void
}

// KEEP YOUR EXISTING PATHS if they differ from these
const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Income Management', to: '/income' },
  { label: 'Expenses & Deductions', to: '/expenses' },
  { label: 'Tax Calculator', to: '/tax-calculator' },
  { label: 'Tax Returns', to: '/tax-returns' },
  { label: 'Documents', to: '/documents' },
  { label: 'Find a Tax Advisor', to: '/tax-advisor' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-4 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B84B1] ${
    isActive ? 'bg-[#5B84B1] font-medium text-white shadow-sm' : 'text-blue-800 hover:bg-white/60'
  }`

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
)

function Sidebar({ open = false, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
  clearSession();
  navigate("/login", { replace: true });
};

  return (
    <>
      {/* Dark overlay behind the drawer (below lg only) */}
      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
  className={`flex h-full w-56 shrink-0 flex-col border-r border-blue-200 bg-[#DCEAF8]
    max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:h-dvh max-lg:transition-transform max-lg:duration-200 motion-reduce:transition-none
    ${open ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}`}
>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-3 rounded-md p-2 text-blue-800 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B84B1] lg:hidden"
        >
          ✕
        </button>

        <div className="px-6 pb-6 pt-7">
          <div className="text-2xl font-bold leading-none tracking-tight text-[#173453]">
            Tax<span className="text-sky-400">Mate</span>
          </div>
          <p className="mt-1.5 text-[10px] font-medium tracking-[0.15em] text-blue-600">TAX MANAGEMENT</p>
        </div>

        <nav aria-label="Main" className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-4 py-2">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-blue-200 px-6 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md text-sm text-blue-800 transition-colors hover:text-[#173453] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B84B1]"
          >
            <LogoutIcon />
            Log Out
          </button>
          <p className="mt-3 text-[11px] text-blue-400">TaxMate • Sri Lanka</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar