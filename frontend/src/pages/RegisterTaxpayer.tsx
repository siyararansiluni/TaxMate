import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import RegisterLayout from '../components/RegisterLayout'
import { Field, PasswordField } from '../components/FormFields'

type Form = {
  name: string
  email: string
  nic: string
  password: string
  confirm: string
}

const empty: Form = { name: '', email: '', nic: '', password: '', confirm: '' }

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {}
  if (!f.name.trim()) e.name = 'Please enter your full name.'
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
  // Old NIC: 9 digits + V/X. New NIC: 12 digits.
  if (!/^(\d{9}[vVxX]|\d{12})$/.test(f.nic.trim()))
    e.nic = 'Enter a valid NIC (e.g. 123456789V or 200012345678).'
  if (f.password.length < 8) e.password = 'Password must be at least 8 characters.'
  if (f.confirm !== f.password) e.confirm = 'Passwords do not match.'
  return e
}

export default function RegisterTaxpayer() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [success, setSuccess] = useState(false)

  // After success, show the message briefly, then go to login
  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => navigate('/login', { replace: true }), 1800)
    return () => clearTimeout(t)
  }, [success, navigate])

  const set =
    (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // TODO: call the backend register API here when it is ready.
    setSuccess(true)
  }

  return (
    <RegisterLayout
      title="Create your Taxpayer Account"
      subtitle="Start managing your income, deductions and tax return drafts."
      cardTitle="Your taxes, made simpler"
      points={[
        'Personalized financial overview',
        'Secure document organization',
        'Guided tax return preparation',
        'Clear progress and validation',
      ]}
      formTitle="Taxpayer registration"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <Field id="name" label="Name" placeholder="Your full name"
          value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Field id="email" label="Email address" type="email" placeholder="name@example.com"
          value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <Field id="nic" label="NIC" placeholder="National Identity Card Number"
          value={form.nic} onChange={set('nic')} error={errors.nic} />
        <PasswordField id="password" label="Password" placeholder="Create a password"
          value={form.password} onChange={set('password')} error={errors.password}
          autoComplete="new-password" />
        <PasswordField id="confirm" label="Confirm password" placeholder="Re-enter your password"
          value={form.confirm} onChange={set('confirm')} error={errors.confirm}
          autoComplete="new-password" />

        {success && (
          <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
            ✓ Account created successfully! Taking you to login…
          </p>
        )}

        <button
          type="submit"
          disabled={success}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:opacity-60"
        >
          Create account
        </button>
        <p className="text-xs text-slate-500">
          By registering, you agree to the terms and privacy policy.
        </p>
      </form>
    </RegisterLayout>
  )
}