import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAdvisor } from '../data/Advisors'
import ConnectionRequestModal from '../components/ConnectionRequestModal'
import type { ConnectionRequest } from '../components/ConnectionRequestModal'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-6 w-6',
  'aria-hidden': true,
}

const ContactIcon = () => (
  <svg {...iconProps}>
    <circle cx="7.5" cy="9" r="2.5" />
    <path d="M3 17c.5-2.2 2.4-3.3 4.5-3.3s4 1.1 4.5 3.3M15 8h6M15 12h6M15 16h6" />
  </svg>
)

const ServicesIcon = () => (
  <svg {...iconProps}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
)

// Icon + short description for each service. The key must match the service name exactly.
const SERVICE_DETAILS: Record<string, { description: string; icon: ReactNode }> = {
  'Individual Tax Consultation': {
    description: 'One-to-one tax guidance',
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.7-3.5 3.6-5 7-5s6.3 1.5 7 5" />
      </>
    ),
  },
  'Tax Return Preparation': {
    description: 'Prepare and file your return',
    icon: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5M9 14l2 2 4-4" />
      </>
    ),
  },
  'Tax Planning and Advisory': {
    description: 'Plan ahead and reduce tax',
    icon: <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" />,
  },
  'Income Tax Compliance': {
    description: 'Stay within the regulations',
    icon: (
      <>
        <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  'Review of Tax Assessments': {
    description: 'Check and challenge assessments',
    icon: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.5-4.5" />
      </>
    ),
  },
}

// Used for any service name that isn't in the list above
const FALLBACK_DETAILS = {
  description: '',
  icon: <path d="M5 12.5 10 17.5 19 7" />,
}

function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-blue-300 bg-blue-50/50 p-6">
      <div className="flex items-center gap-3 text-blue-600">
        {icon}
        <h2 className="text-base font-semibold text-[#173453]">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function AdvisorProfile() {
  const { advisorId } = useParams()
  const advisor = getAdvisor(advisorId)

  // Controls the "Send connection request" popup (must be above the early return)
  const [showRequestModal, setShowRequestModal] = useState(false)

  if (!advisor) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#173453]">Advisor not found</h1>
        <Link to="/tax-advisor" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline">
          ← Back to advisors
        </Link>
      </div>
    )
  }

  const contact = [
    { label: 'Phone Number', value: advisor.phone },
    { label: 'Email Address', value: advisor.email },
    { label: 'Office Address', value: advisor.address },
    { label: 'Working Hours', value: advisor.hours },
  ]

  const handleSubmitRequest = async ({ service, message }: ConnectionRequest) => {
    // TODO: replace with your real API call.
    // Throw an error if it fails so the modal shows the error message, e.g.:
    // const res = await fetch('/api/connection-requests', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ advisorId, service, message }),
    // })
    // if (!res.ok) throw new Error('Request failed')
    console.log('Connection request:', { advisorId, service, message })
  }

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <Link
          to="/tax-advisor"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white py-1.5 pl-2 pr-3 text-sm text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M12.7 5.3a1 1 0 0 1 0 1.4L9.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
          Back to advisors
        </Link>
        <h1 className="mt-3 text-[28px] font-bold tracking-tight text-[#173453]">Advisor Profile</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          View advisor details and get in touch for tax consultation.
        </p>
      </header>

      {/* Hero card */}
      <section className="rounded-xl border border-blue-400 bg-blue-50 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-400 bg-white text-base font-semibold text-[#173453]">
              {advisor.initials}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[#173453]">{advisor.name}</h2>
              <p className="text-sm text-slate-600">{advisor.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] text-slate-600">
                  Verified advisor
                </span>
                <span className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] text-slate-600">
                  {advisor.years} years experience
                </span>
              </div>
            </div>
          </div>

          {/* Was a mailto link; now opens the popup */}
          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Request Consultation <span aria-hidden>→</span>
          </button>
        </div>

        <h3 className="mt-6 text-sm font-semibold text-[#173453]">About</h3>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">{advisor.about}</p>
      </section>

      {/* Details */}
      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard icon={<ContactIcon />} title="Contact Information">
          <dl className="space-y-4">
            {contact.map((c) => (
              <div key={c.label}>
                <dt className="text-xs text-slate-500">{c.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-[#173453]">{c.value}</dd>
              </div>
            ))}
          </dl>
        </InfoCard>

        <InfoCard icon={<ServicesIcon />} title="Tax Services">
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {advisor.services.map((s) => {
              const details = SERVICE_DETAILS[s] ?? FALLBACK_DETAILS
              return (
                <li key={s} className="flex items-start gap-3 rounded-lg bg-white p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      {details.icon}
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#173453]">{s}</p>
                    {details.description && (
                      <p className="mt-0.5 text-xs text-slate-500">{details.description}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </InfoCard>
      </div>

      <ConnectionRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        advisor={{ name: advisor.name, title: advisor.title }}
        services={advisor.services}
        onSubmit={handleSubmitRequest}
      />
    </div>
  )
}

export default AdvisorProfile