import type { ReactNode } from 'react'
import BackButton from './BackButton'

interface Props {
  title: string
  subtitle: string
  cardTitle: string
  points: string[]
  formTitle: string
  children: ReactNode
}

export default function RegisterLayout({
  title,
  subtitle,
  cardTitle,
  points,
  formTitle,
  children,
}: Props) {
  return (
    <main className="h-dvh overflow-y-auto bg-linear-to-br from-white via-blue-50 to-blue-100 text-slate-800 [scrollbar:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-4 sm:px-10 lg:px-16">
        {/* Header: logo on the left, back button on the right */}
        <header className="flex items-center justify-between">
          <p className="text-2xl font-bold text-[#173453]">
            Tax<span className="text-sky-400">Mate</span>
          </p>
          <BackButton
            to="/login"
            state={{ openAccountType: true }}
            className="py-1.5"
          >
            Back to account type
          </BackButton>
        </header>

        {/* Both columns start at the top */}
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-12">
          <section className="lg:pt-6">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#14284b] lg:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

            <div className="mt-8 hidden rounded-xl border border-blue-300 bg-white/70 p-6 lg:block">
              <h2 className="text-lg font-bold text-[#14284b]">{cardTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-blue-600" aria-hidden>
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-xl border border-blue-300 bg-white p-5 shadow-lg shadow-blue-900/5">
            <h2 className="text-lg font-bold text-[#14284b]">{formTitle}</h2>
            <div className="mt-3">{children}</div>
          </section>
        </div>
      </div>
    </main>
  )
}