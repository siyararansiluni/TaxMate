import { useState } from 'react'
import { Link } from 'react-router-dom'

type Period = 'Monthly' | 'Quarterly' | 'Yearly'
type IconType = 'users' | 'advisor' | 'clock' | 'user' | 'document' | 'group' | 'settings'

const chartData: Record<
  Period,
  { labels: string[]; users: number[]; advisors: number[] }
> = {
  Monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    users: [4500, 5400, 5100, 5700, 6200, 5700, 6200, 6200, 6600, 7000, 7300, 7600],
    advisors: [3300, 4000, 3700, 3500, 4000, 3600, 4100, 4600, 5100, 5600, 5400, 6000],
  },
  Quarterly: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    users: [5000, 5900, 6500, 7300],
    advisors: [3600, 3900, 4700, 5600],
  },
  Yearly: {
    labels: ['2022', '2023', '2024', '2025', '2026'],
    users: [3200, 4400, 5600, 6500, 7600],
    advisors: [2100, 3000, 3900, 4700, 6000],
  },
}

const activities: {
  title: string
  detail: string
  time: string
  icon: IconType
  color: string
}[] = [
  {
    title: 'New user registered',
    detail: 'user123@example.com',
    time: '2 minutes ago',
    icon: 'user',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Tax rule updated',
    detail: 'by Admin',
    time: '5 minutes ago',
    icon: 'document',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    title: 'New advisor approved',
    detail: 'by Admin',
    time: '10 minutes ago',
    icon: 'group',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    title: 'System settings updated',
    detail: 'by Admin',
    time: '15 minutes ago',
    icon: 'settings',
    color: 'bg-orange-100 text-orange-600',
  },
]

const regions = [
  { name: 'Colombo District', users: 2450 },
  { name: 'Gampaha District', users: 1820 },
  { name: 'Kalutara District', users: 1320 },
  { name: 'Other Regions', users: 2630 },
]

function Icon({ type, className = 'h-6 w-6' }: { type: IconType; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {type === 'users' && (
        <>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 19v-1a6 6 0 0 1 12 0v1H3Z" />
          <path d="M16 14a5 5 0 0 1 5 5h-4" />
        </>
      )}
      {type === 'advisor' && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      )}
      {type === 'clock' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
      {type === 'user' && (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </>
      )}
      {type === 'document' && (
        <>
          <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </>
      )}
      {type === 'group' && (
        <>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 20a6 6 0 0 1 12 0M16 15a5 5 0 0 1 5 5" />
        </>
      )}
      {type === 'settings' && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.7Z" />
        </>
      )}
    </svg>
  )
}

function AdminDashboard() {
  const [period, setPeriod] = useState<Period>('Monthly')
  const data = chartData[period]
  const maxUsers = Math.max(...regions.map((region) => region.users))

  const chartX = (index: number) =>
    48 + (index / (data.labels.length - 1)) * 620

  const chartY = (value: number) => 178 - (value / 8000) * 145

  const userPoints = data.users
    .map((value, index) => `${chartX(index)},${chartY(value)}`)
    .join(' ')

  const advisorPoints = data.advisors
    .map((value, index) => `${chartX(index)},${chartY(value)}`)
    .join(' ')

  return (
    <div className="space-y-4 bg-slate-50 p-4 text-[#173453] sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-[28px]">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Overview of system activity and pending actions.
          </p>
        </div>

        <label className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm shadow-sm">
          <span className="sr-only">Date range</span>
          <span aria-hidden="true">▦</span>
          <select className="bg-transparent outline-none">
            <option>Last 12 Months</option>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
          </select>
        </label>
      </header>

      <section
        aria-label="Dashboard statistics"
        className="grid gap-4 md:grid-cols-3"
      >
        <StatCard
          icon="users"
          label="Total Users"
          value="12,540"
          detail="8.5% from last period"
        />
        <StatCard
          icon="advisor"
          label="Tax Advisors"
          value="48"
          detail="12.3% from last period"
        />
        <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <Icon type="clock" className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold">Pending Advisor Approvals</p>
            <p className="mt-1 text-2xl font-bold">07</p>
            <Link
              to="/admin/users"
              className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Review Requests →
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="rounded-xl border border-blue-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold">▥ &nbsp; System Overview</h2>
            <div
              className="flex rounded-full bg-slate-50 p-1"
              aria-label="Chart period"
            >
              {(['Monthly', 'Quarterly', 'Yearly'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPeriod(option)}
                  aria-pressed={period === option}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    period === option
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-blue-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex justify-end gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              Users
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
              Advisors
            </span>
          </div>

          <div className="mt-2 overflow-hidden">
            <svg
              viewBox="0 0 700 220"
              className="w-full"
              role="img"
              aria-label={`${period} user and advisor activity chart`}
            >
              {[0, 2000, 4000, 6000, 8000].map((tick) => {
                const y = chartY(tick)
                return (
                  <g key={tick}>
                    <line
                      x1="48"
                      y1={y}
                      x2="680"
                      y2={y}
                      stroke="#E5EDF8"
                    />
                    <text
                      x="8"
                      y={y + 4}
                      fill="#64748B"
                      fontSize="12"
                    >
                      {tick === 0 ? '0' : `${tick / 1000}k`}
                    </text>
                  </g>
                )
              })}

              {data.labels.map((label, index) => (
                <g key={label}>
                  <line
                    x1={chartX(index)}
                    y1="33"
                    x2={chartX(index)}
                    y2="178"
                    stroke="#F1F5F9"
                  />
                  <text
                    x={chartX(index)}
                    y="202"
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="11"
                  >
                    {label}
                  </text>
                </g>
              ))}

              <polyline
                points={userPoints}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <polyline
                points={advisorPoints}
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {data.users.map((value, index) => (
                <circle
                  key={`user-${index}`}
                  cx={chartX(index)}
                  cy={chartY(value)}
                  r="3.5"
                  fill="#2563EB"
                />
              ))}
              {data.advisors.map((value, index) => (
                <circle
                  key={`advisor-${index}`}
                  cx={chartX(index)}
                  cy={chartY(value)}
                  r="3.5"
                  fill="#2DD4BF"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-white p-4">
          <h2 className="font-bold">
            <span className="text-blue-600">●</span> &nbsp; User Distribution
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-5 py-5">
            <div
              className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  'conic-gradient(#2563EB 0% 68%, #2DD4BF 68% 88%, #8B5CF6 88% 100%)',
              }}
              role="img"
              aria-label="User distribution: taxpayers 68%, tax advisors 20%, administrators 12%"
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center">
                <strong className="text-xl">12,540</strong>
                <span className="text-xs">Total Users</span>
              </div>
            </div>

            <ul className="space-y-3 text-sm">
              <Legend color="bg-blue-600" label="Taxpayers" value="68%" />
              <Legend color="bg-teal-400" label="Tax Advisors" value="20%" />
              <Legend color="bg-violet-500" label="Administrators" value="12%" />
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">⚡ &nbsp; Recent Activities</h2>
            <Link
              to="/admin/users"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>

          <ul className="mt-3 divide-y divide-slate-100">
            {activities.map((activity) => (
              <li
                key={activity.title}
                className="flex items-center gap-3 py-2.5"
              >
                <span className={`rounded-full p-2 ${activity.color}`}>
                  <Icon type={activity.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{activity.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {activity.detail}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-slate-500">
                  {activity.time}
                </time>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-blue-200 bg-white p-4">
          <h2 className="font-bold">📍 &nbsp; Top Regions by User Count</h2>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 bg-blue-50 px-3 py-2 text-xs font-semibold">
            <span>Region</span>
            <span>Users</span>
          </div>
          <ul>
            {regions.map((region) => (
              <li
                key={region.name}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-slate-100 px-3 py-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-32 shrink-0 truncate sm:w-36">
                    {region.name}
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-blue-50">
                    <span
                      className="block h-full rounded-full bg-blue-600"
                      style={{
                        width: `${(region.users / maxUsers) * 100}%`,
                      }}
                    />
                  </span>
                </span>
                <span>{region.users.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: IconType
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-white p-4">
      <div className="rounded-full bg-blue-50 p-3 text-blue-600">
        <Icon type={icon} className="h-8 w-8" />
      </div>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-emerald-500">↑ &nbsp;{detail}</p>
      </div>
    </div>
  )
}

function Legend({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <li className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
      <span className="font-medium">({value})</span>
    </li>
  )
}

export default AdminDashboard