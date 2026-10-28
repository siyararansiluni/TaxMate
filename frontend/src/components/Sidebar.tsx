import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Income Management', path: '/income', icon: '↗' },
  { label: 'Expenses & Deductions', path: '/expenses', icon: '▤' },
  { label: 'Tax Calculator', path: '/tax-calculator', icon: '▣' },
  { label: 'Tax Returns', path: '/tax-returns', icon: '▧' },
  { label: 'Documents', path: '/documents', icon: '▤' },
  { label: 'Find a Tax Advisor', path: '/tax-advisors', icon: '♧' },
]

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-100 px-6 py-6">
        <h1 className="text-2xl font-bold text-[#173453]">
          Tax<span className="text-blue-600">Mate</span>
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Personalized Tax Assistant
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-l-4 border-blue-600 bg-blue-50 text-[#173453]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-[#173453]'
            }`
          }
        >
          <span className="w-5 text-center text-lg" aria-hidden="true">
            ▦
          </span>
          Dashboard
        </NavLink>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-4 border-blue-600 bg-blue-50 text-[#173453]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#173453]'
              }`
            }
          >
            <span className="w-5 text-center text-lg" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <p className="text-xs text-slate-500">TaxMate</p>
        <p className="mt-1 text-sm font-medium text-[#173453]">
          Taxpayer Portal
        </p>
      </div>
    </aside>
  )
}

export default Sidebar