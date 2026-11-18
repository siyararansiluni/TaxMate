const stats = [
  { label: 'Profile views', value: '128' },
  { label: 'Client enquiries', value: '08' },
  { label: 'Active clients', value: '05' },
]

const enquiries = [
  {
    name: 'Kamal Perera',
    topic: 'Tax return preparation',
    date: '18 Oct 2026',
    status: 'New',
    action: 'Review',
  },
  {
    name: 'Nimali Silva',
    topic: 'Self-employment income',
    date: '16 Oct 2026',
    status: 'In progress',
    action: 'View',
  },
  {
    name: 'Kasun Jayawardena',
    topic: 'Deductions guidance',
    date: '12 Oct 2026',
    status: 'Responded',
    action: 'View',
  },
]

function AdvisorDashboard() {
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-slate-900">Advisor Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Overview of your advisory profile and taxpayer enquiries.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[#5B84B1] bg-white p-5"
          >
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent enquiries table */}
      <h2 className="mt-10 text-sm font-semibold text-slate-900">
        Recent enquiries
      </h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-[#5B84B1] bg-white">
        <table className="w-full min-w-150 text-left text-sm">
          <thead className="bg-blue-50 text-xs text-slate-700">
            <tr>
              <th className="px-4 py-3">Taxpayer</th>
              <th className="px-4 py-3">Enquiry topic</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.name} className="border-t border-slate-100">
                <td className="px-4 py-4 font-medium text-slate-900">
                  {e.name}
                </td>
                <td className="px-4 py-4 text-slate-500">{e.topic}</td>
                <td className="px-4 py-4 text-slate-500">{e.date}</td>
                <td className="px-4 py-4 text-slate-500">{e.status}</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    className="text-[#5B84B1] hover:underline"
                  >
                    {e.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile reminder */}
      <div className="mt-8 rounded-xl border border-[#5B84B1] bg-white p-5">
        <p className="text-sm font-semibold text-slate-900">
          Keep your advisor profile up to date
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Your qualifications, experience and contact details help taxpayers
          understand your services.
        </p>
      </div>
    </div>
  )
}

export default AdvisorDashboard