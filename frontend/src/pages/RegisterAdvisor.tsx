import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import RegisterLayout from '../components/RegisterLayout'
import { Field, PasswordField, SelectField } from '../components/FormFields'

type Form = {
  name: string
  email: string
  phone: string
  qualification: string
  license: string
  experience: string
  password: string
}

const empty: Form = {
  name: '', email: '', phone: '', qualification: '',
  license: '', experience: '', password: '',
}

const QUALIFICATIONS = [
  'CA Sri Lanka (ACA)',
  'ACCA',
  'CIMA',
  "Bachelor's degree in Accounting / Finance",
  'LLB (Tax Law)',
  'Other',
]
const EXPERIENCE = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years']

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {}
  if (!f.name.trim()) e.name = 'Please enter your full name.'
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
  // Sri Lankan numbers: 0771234567 or +94771234567
  if (!/^(\+94|0)\d{9}$/.test(f.phone.replace(/\s/g, '')))
    e.phone = 'Enter a valid phone number (e.g. 0771234567).'
  if (!f.qualification) e.qualification = 'Select your qualification.'
  if (!f.license.trim()) e.license = 'Enter your registration / license number.'
  if (!f.experience) e.experience = 'Select your years of experience.'
  if (f.password.length < 8) e.password = 'Password must be at least 8 characters.'
  return e
}

export default function RegisterAdvisor() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => navigate('/login', { replace: true }), 1800)
    return () => clearTimeout(t)
  }, [success, navigate])

  const set =
    (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  const setValue = (key: keyof Form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

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
      title="Become a TaxMate Advisor"
      subtitle="Build your professional profile and connect with taxpayers."
      cardTitle="Grow your advisory practice"
      points={[
        'Personalized financial overview',
        'Secure document organization',
        'Guided tax return preparation',
        'Clear progress and validation',
      ]}
      formTitle="Advisor registration"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-[clamp(0.5rem,1.6dvh,1rem)]">
        <Field id="name" label="Full name" placeholder="Your full name"
          value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Field id="email" label="Email address" type="email" placeholder="name@example.com"
          value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <Field id="phone" label="Phone number" type="tel" placeholder="0771234567"
          value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
        <SelectField id="qualification" label="Professional qualification"
          placeholder="Select qualification" options={QUALIFICATIONS}
          value={form.qualification} onChange={setValue('qualification')}
          error={errors.qualification} />
        <Field id="license" label="Registration / license number" placeholder="Enter number"
          value={form.license} onChange={set('license')} error={errors.license} />
        <SelectField id="experience" label="Years of experience"
          placeholder="Select experience" options={EXPERIENCE}
          value={form.experience} onChange={setValue('experience')}
          error={errors.experience} />
        <PasswordField id="password" label="Password" placeholder="Create password"
          value={form.password} onChange={set('password')} error={errors.password}
          autoComplete="new-password" />

        {success && (
          <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
            ✓ Account created successfully! Taking you to login…
          </p>
        )}

        <button
          type="submit"
          disabled={success}
          // the Create account button: change py-3 to this
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