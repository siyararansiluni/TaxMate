import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'

export interface Advisor {
  name: string
  title: string // e.g. "Tax Practitioner"
}

export interface ConnectionRequest {
  service: string
  message: string
}

interface ConnectionRequestModalProps {
  open: boolean
  onClose: () => void
  advisor: Advisor
  services?: string[]
  onSubmit: (request: ConnectionRequest) => Promise<void> | void
}

const DEFAULT_SERVICES = [
  'Individual Tax Consultation',
  'Tax Return Preparation',
  'Tax Planning and Advisory',
  'Income Tax Compliance',
  'Review of Tax Assessments',
]

const NEXT_STEPS = [
  'The advisor reviews your request and accepts or rejects it.',
  'If accepted, a private live chat opens between you both.',
  'You can then schedule a consultation meeting in TaxMate.',
]

function getInitials(name: string) {
  return name
    .replace(/\./g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

/**
 * Outer wrapper: renders nothing while closed. Because the inner content is
 * unmounted when closed, its state (step, service, message...) starts fresh
 * every time the modal opens, so no reset effect is needed.
 */
function ConnectionRequestModal(props: ConnectionRequestModalProps) {
  if (!props.open) return null
  return <ModalContent {...props} />
}

function ModalContent({
  onClose,
  advisor,
  services = DEFAULT_SERVICES,
  onSubmit,
}: ConnectionRequestModalProps) {
  const titleId = useId()
  const [step, setStep] = useState<'form' | 'sent'>('form')
  const [service, setService] = useState(services[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Close on Escape + lock background scroll while open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({ service, message: message.trim() })
      setStep('sent') // show the "Request sent" popup instead of closing
    } catch {
      setError('Could not send your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = getInitials(advisor.name)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full rounded-xl bg-white shadow-xl ${step === 'sent' ? 'max-w-sm' : 'max-w-md'}`}
      >
        {step === 'form' ? (
          <>
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="text-base font-semibold text-slate-900">
                  Send connection request
                </h2>
                <p className="truncate text-sm text-slate-500">
                  to {advisor.name} · {advisor.title}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
              <div>
                <label htmlFor="consult-service" className="mb-1.5 block text-sm font-medium text-slate-700">
                  What do you need guidance on?
                </label>
                <div className="relative">
  <select
    id="consult-service"
    autoFocus
    value={service}
    onChange={(e) => setService(e.target.value)}
    className="w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-3.5 pr-10 text-sm text-slate-900 transition-colors hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
  >
    {services.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>

  {/* Custom arrow */}
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
    aria-hidden="true"
  >
    <path d="m5 7.5 5 5 5-5" />
  </svg>
</div>
              </div>

              <div>
                <label htmlFor="consult-message" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Message to the advisor <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="consult-message"
                  rows={4}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Briefly describe your tax question or situation..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* What happens next */}
              <div className="rounded-lg bg-blue-50 p-3.5">
                <p className="mb-2 text-sm font-semibold text-slate-800">What happens next</p>
                <ol className="space-y-2">
                  {NEXT_STEPS.map((text, i) => (
                    <li key={text} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                        {i + 1}
                      </span>
                      {text}
                    </li>
                  ))}
                </ol>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="cursor-pointer rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* "Request sent" confirmation */
          <div className="px-6 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6 text-blue-600" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </div>

            <h2 id={titleId} className="mt-4 text-lg font-semibold text-slate-900">
              Request sent
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your connection request has been sent to {advisor.name}. We'll notify you when they respond.
            </p>

            {/* Summary row */}
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-blue-50/50 px-3 py-2.5 text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{advisor.name}</p>
                <p className="truncate text-xs text-slate-500">{service}</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Pending
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectionRequestModal