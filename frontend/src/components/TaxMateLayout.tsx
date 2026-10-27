
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

type Props = {
  title: string
  children: ReactNode
}

const navigation = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Income Management', path: '/income' },
  { label: 'Expenses & Deductions', path: '/expenses' },
  { label: 'Tax Calculator', path: '/tax-calculator' },
  { label: 'Tax Returns', path: '/tax-returns' },
  { label: 'Documents', path: '/documents' },
  { label: 'Find a Tax Advisor', path: '/tax-advisor' },
]

export default function TaxMateLayout({ title, children }: Props) {
  const location = useLocation()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-name">
            Tax<span>Mate</span>
          </span>
          <span className="brand-caption">TAX MANAGEMENT</span>
        </Link>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="logout-link">
            ↪ Log Out
          </Link>
          <p>TaxMate • Sri Lanka</p>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs">
            <Link to="/">TaxMate</Link>
            <span>/</span>
            <span>{title}</span>
          </div>

          <div className="topbar-right">
            <span className="tax-year">2025 / 2026</span>
            <span className="avatar">K</span>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
