
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/* ---------- Icons (inline SVG, no extra dependency) ---------- */
function Svg({ children, className = 'h-5 w-5' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  )
}

const TrendIcon = () => (
  <Svg>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </Svg>
)
const CalculatorIcon = () => (
  <Svg>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" />
  </Svg>
)
const ReceiptIcon = () => (
  <Svg>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
    <path d="M9 8h6M9 12h6" />
  </Svg>
)
const FileCheckIcon = () => (
  <Svg>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
    <path d="M14 3v5h5M9 14l2 2 4-4" />
  </Svg>
)
const ArrowIcon = () => (
  <Svg className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

/* ---------- Data ---------- */
const STATS = [
  { label: 'Total Income', value: 'No income recorded yet', icon: <TrendIcon />, tone: 'bg-blue-100 text-blue-600' },
  { label: 'Estimated Tax', value: 'Not calculated yet', icon: <CalculatorIcon />, tone: 'bg-teal-100 text-teal-600' },
  { label: 'Recorded Expenses', value: 'No deductions recorded', icon: <ReceiptIcon />, tone: 'bg-amber-100 text-amber-600' },
  { label: 'Tax Return Status', value: 'Not started', icon: <FileCheckIcon />, tone: 'bg-violet-100 text-violet-600' },
]

// TODO: make sure these paths match AppRoutes.tsx
const NEXT_STEPS = [
  { no: '01', title: 'Add income records', text: 'Keep all your income sources up to date.', to: '/income' },
  { no: '02', title: 'Review deductions', text: 'Identify deductible expenses.', to: '/expenses' },
  { no: '03', title: 'Prepare your return', text: 'Create a draft and validate it.', to: '/tax-returns' },
]

/* ---------- Page ---------- */
function TaxPayerDashboard() {
  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Heading */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[#173453]">Dashboard</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Welcome back, Kamal! Here is your financial overview.
        </p>
      </header>

      {/* Banner (light blue, as in Figma) */}
      <section className="rounded-2xl border border-blue-300 bg-blue-50 p-6 sm:p-7">
        <h2 className="text-xl font-semibold text-[#173453]">Complete your tax profile</h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Choose your income sources to personalize your TaxMate experience.
        </p>
        <Link
          to="/profile"
          className="group mt-5 inline-flex items-center gap-2 rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-[#173453] shadow-sm transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Complete tax profile
          <span className="text-teal-600">
            <ArrowIcon />
          </span>
        </Link>
      </section>

      {/* Stats */}
      <section aria-label="Overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <article
            key={s.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.tone}`}>
              {s.icon}
            </span>
            <div className="min-w-0">
              <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</h2>
              <p className="mt-1 text-sm font-semibold text-[#173453]">{s.value}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Next steps */}
      <section>
        <h2 className="text-lg font-semibold text-[#173453]">Your next steps</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {NEXT_STEPS.map((s) => (
            <Link
              key={s.no}
              to={s.to}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="relative">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {s.no}
                </span>
                <h3 className="mt-4 font-semibold text-[#173453]">{s.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{s.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600">
                  Get started <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TaxPayerDashboard