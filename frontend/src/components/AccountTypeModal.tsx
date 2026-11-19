import { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'
import BackButton from './BackButton'


interface Props {
  open: boolean
  onClose: () => void
}

const options = [
  {
    icon: '👤',
    title: 'Tax Payer',
    text: 'Manage income and prepare your tax return.',
    button: 'Continue as Tax Payer',
    to: '/register/taxpayer',
  },
  {
    icon: '💼',
    title: 'Tax Advisor',
    text: 'Build your profile and connect with taxpayers.',
    button: 'Continue as Tax Advisor',
    to: '/register/advisor',
  },
]

export default function AccountTypeModal({ open, onClose }: Props) {
  const navigate = useNavigate()

  // Close with the Esc key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-type-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl border border-blue-400 bg-white p-6 shadow-2xl sm:p-10"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="text-2xl font-bold text-[#173453]">
          Tax<span className="text-sky-400">Mate</span>
        </p>
        <h2
          id="account-type-title"
          className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900"
        >
          Choose your account type
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          How would you like to use TaxMate?
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {options.map((o) => (
            <div
              key={o.title}
              className="flex flex-col items-center rounded-xl border border-blue-400 p-5 text-center"
            >
              <h3 className="text-xl font-bold text-slate-900">
                <span aria-hidden>{o.icon}</span> {o.title}
              </h3>
              <p className="mt-2 text-sm text-slate-700">{o.text}</p>
              <button
                type="button"
                onClick={() => navigate(o.to)}
                className="mt-4 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                {o.button}
              </button>
            </div>
          ))}
        </div>

        <BackButton to="/home" className="mt-8">
  Back to Home
</BackButton>
      </div>
    </div>
  )
}