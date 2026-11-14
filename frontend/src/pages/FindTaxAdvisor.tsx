import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ADVISORS } from '../data/Advisors'

const ALL = 'All specializations'
const SPECIALIZATIONS = [ALL, ...Array.from(new Set(ADVISORS.map((a) => a.specialization)))]

const inputClass =
  'h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'

/* ---------- Icons (inline SVG) ---------- */
function Icon({ children, className = 'h-4 w-4' }: { children: ReactNode; className?: string }) {
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
const BriefcaseIcon = () => (
  <Icon>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
  </Icon>
)
const PinIcon = () => (
  <Icon>
    <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
)
const ArrowIcon = () => (
  <Icon className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)

/** True if any word in the text starts with what the user typed. */
function wordStartsWith(text: string, q: string) {
  return text
    .toLowerCase()
    .split(/[\s.,\-/&]+/)
    .some((word) => word.startsWith(q))
}

function FindTaxAdvisor() {
  const [query, setQuery] = useState('')
  const [spec, setSpec] = useState(ALL)

  // Live search: the list updates on every keystroke, no button needed
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()

    return ADVISORS.filter((a) => {
      const matchesSpec = spec === ALL || a.specialization === spec
      const matchesQuery = !q || wordStartsWith(a.name, q) || wordStartsWith(a.specialization, q)
      return matchesSpec && matchesQuery
    }).sort((a, b) => {
      // advisors whose name starts with the typed text come first
      if (!q) return 0
      const aFirst = a.name.toLowerCase().startsWith(q) ? 0 : 1
      const bFirst = b.name.toLowerCase().startsWith(q) ? 0 : 1
      return aFirst - bFirst
    })
  }, [query, spec])

  // The Search button / Enter key just keeps the page from reloading
  const handleSubmit = (e: FormEvent) => e.preventDefault()

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-[28px] font-bold tracking-tight text-[#173453]">Find a Tax Advisor</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Explore advisor profiles and contact a professional.
        </p>
      </header>

      {/* Filters grouped in one card */}
      <form
        onSubmit={handleSubmit}
        className="grid items-end gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[2fr_1fr_auto]"
      >
        <div>
          <label htmlFor="advisor-search" className="mb-1.5 block text-sm font-medium text-[#173453]">
            Search advisors
          </label>
          <input
            id="advisor-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or specialization"
            autoComplete="off"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="advisor-spec" className="mb-1.5 block text-sm font-medium text-[#173453]">
            Specialization
          </label>

          {/* relative wrapper keeps the custom arrow inside the field */}
          <div className="relative">
            <select
              id="advisor-spec"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className={`${inputClass} appearance-none pr-11`}
            >
              {SPECIALIZATIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          className="h-10 rounded-md bg-blue-600 px-8 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Search
        </button>
      </form>

      {/* Results */}
      <section aria-label="Available advisors">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-[#173453]">Available advisors</h2>
          <p className="text-sm text-slate-500" aria-live="polite">
            {results.length} {results.length === 1 ? 'advisor' : 'advisors'} found
          </p>
        </div>

        {results.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No advisors match your search. Try a different name or specialization.
          </p>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((a) => (
              <article
                key={a.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-[#173453] ring-4 ring-blue-50">
                    {a.initials}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-[#173453]">{a.name}</h3>
                    <p className="text-sm text-slate-500">{a.title}</p>
                  </div>
                </div>

                <span className="mt-4 inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {a.specialization}
                </span>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-[#5B84B1]"><BriefcaseIcon /></span>
                    {a.years} years experience
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#5B84B1]"><PinIcon /></span>
                    {a.location}
                  </li>
                </ul>

                <Link
                  to={`/tax-advisor/${a.id}`}
                  className="group/btn mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-300 py-2.5 text-sm font-medium text-[#173453] transition-colors hover:border-[#5B84B1] hover:bg-[#5B84B1] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  View profile <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default FindTaxAdvisor