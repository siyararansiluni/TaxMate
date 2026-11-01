
import { useMemo, useState } from 'react'

type Income = {
  id: number
  source: string
  category: string
  amount: number
  frequency: string
  year: string
  employer?: string
  monthsWorked?: string
  description?: string
}

const initialIncome: Income[] = [
  {
    id: 1,
    source: 'Monthly salary',
    category: 'Employment',
    amount: 1800000,
    frequency: 'Monthly',
    year: '2025 / 2026',
    employer: 'ABC Company',
    monthsWorked: '12',
  },
  {
    id: 2,
    source: 'Freelance projects',
    category: 'Self-employment',
    amount: 450000,
    frequency: 'Variable',
    year: '2025 / 2026',
    description: 'Freelance projects',
  },
  {
    id: 3,
    source: 'Rental property',
    category: 'Rental',
    amount: 240000,
    frequency: 'Monthly',
    year: '2025 / 2026',
  },
  {
    id: 4,
    source: 'Investment returns',
    category: 'Investment',
    amount: 110000,
    frequency: 'Annual',
    year: '2025 / 2026',
  },
]

const categories = [
  'Employment',
  'Business',
  'Self-employment',
  'Rental',
  'Investment',
  'Other',
]

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-LK').format(amount)

function IncomeManagement() {
  const [incomes, setIncomes] = useState<Income[]>(initialIncome)
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('2025 / 2026')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    source: '',
    category: 'Employment',
    amount: '',
    frequency: 'Monthly',
    employer: '',
    monthsWorked: '12',
    description: '',
  })

  const filteredIncome = useMemo(() => {
    return incomes.filter((income) => {
      const matchesYear = income.year === selectedYear
      const matchesSearch =
        income.source.toLowerCase().includes(search.toLowerCase()) ||
        income.category.toLowerCase().includes(search.toLowerCase())

      return matchesYear && matchesSearch
    })
  }, [incomes, selectedYear, search])

  const totalIncome = filteredIncome.reduce(
    (total, income) => total + income.amount,
    0
  )

  const openAddModal = () => {
    setEditingId(null)
    setForm({
      source: '',
      category: 'Employment',
      amount: '',
      frequency: 'Monthly',
      employer: '',
      monthsWorked: '12',
      description: '',
    })
    setError('')
    setShowModal(true)
  }

  const openEditModal = (income: Income) => {
    setEditingId(income.id)
    setForm({
      source: income.source,
      category: income.category,
      amount: String(income.amount),
      frequency: income.frequency,
      employer: income.employer || '',
      monthsWorked: income.monthsWorked || '12',
      description: income.description || '',
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const amount = Number(form.amount)

    if (!form.source.trim()) {
      setError('Please enter an income source.')
      return
    }

    if (!form.amount || !Number.isFinite(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than zero.')
      return
    }

    if (
      form.category === 'Employment' &&
      (!form.monthsWorked ||
        Number(form.monthsWorked) < 1 ||
        Number(form.monthsWorked) > 12)
    ) {
      setError('Months worked must be between 1 and 12.')
      return
    }

    const updatedIncome: Income = {
      id: editingId ?? Date.now(),
      source: form.source.trim(),
      category: form.category,
      amount,
      frequency: form.frequency,
      year: selectedYear,
      employer: form.employer,
      monthsWorked: form.monthsWorked,
      description: form.description,
    }

    if (editingId !== null) {
      setIncomes((previous) =>
        previous.map((income) =>
          income.id === editingId ? updatedIncome : income
        )
      )
    } else {
      setIncomes((previous) => [...previous, updatedIncome])
    }

    setShowModal(false)
    setError('')
  }

  return (
    <div className="min-h-full bg-white px-5 py-6 sm:px-8 lg:px-10">

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#203448] sm:text-[26px]">
          Income Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage your income sources for the selected tax year.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-[#b8cce5] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Total recorded income</p>
          <h2 className="mt-3 text-xl font-bold text-[#203448]">
            LKR {formatMoney(totalIncome)}
          </h2>
          <p className="mt-2 text-[11px] text-[#5b9f9c]">
            {selectedYear}
          </p>
        </div>

        <div className="rounded-xl border border-[#b8cce5] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Income sources</p>
          <h2 className="mt-3 text-xl font-bold text-[#203448]">
            {String(filteredIncome.length).padStart(2, '0')}
          </h2>
          <p className="mt-2 text-[11px] text-[#5b9f9c]">
            Across categories
          </p>
        </div>

        <div className="rounded-xl border border-[#b8cce5] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Last updated</p>
          <h2 className="mt-3 text-xl font-bold text-[#203448]">
            Oct 2026
          </h2>
        </div>

      </div>

      {/* Income records heading and controls */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-base font-bold text-[#263b4d]">
          Income records
        </h2>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-[#2862e8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#194fc9]"
        >
          + Add income
        </button>
      </div>

      {/* Search and year filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search income sources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#c5d3e5] px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:max-w-xs"
        />

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="rounded-lg border border-[#c5d3e5] bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="2025 / 2026">2025 / 2026</option>
          <option value="2024 / 2025">2024 / 2025</option>
          <option value="2026 / 2027">2026 / 2027</option>
        </select>
      </div>

      {/* Income table */}
      <div className="overflow-x-auto rounded-xl border border-[#b8cce5] shadow-sm">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead className="bg-[#edf4ff]">
            <tr className="text-xs font-semibold text-[#40546a]">
              <th className="px-4 py-3.5">Income source</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Amount (LKR)</th>
              <th className="px-4 py-3.5">Frequency</th>
              <th className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredIncome.map((income) => (
              <tr
                key={income.id}
                className="text-xs text-gray-600 transition hover:bg-blue-50/40"
              >
                <td className="px-4 py-4 font-medium text-[#34485a]">
                  {income.source}
                </td>

                <td className="px-4 py-4">{income.category}</td>

                <td className="px-4 py-4">
                  {formatMoney(income.amount)}
                </td>

                <td className="px-4 py-4">{income.frequency}</td>

                {/* Edit only - Delete icon removed */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => openEditModal(income)}
                      title="Edit income"
                      className="text-lg text-gray-600 hover:text-blue-600"
                    >
                      ✎
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredIncome.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  No income records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Tip: Record each income source accurately to improve your estimated tax calculation.
      </p>

      {/* Add / Edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false)
          }}
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl">

            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#203448]">
                  {editingId ? 'Edit income' : 'Add income'}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your income details below.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-6">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Income source *
                </label>
                <input
                  required
                  value={form.source}
                  onChange={(e) =>
                    setForm({ ...form, source: e.target.value })
                  }
                  placeholder="Enter income source"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Income category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employment-specific fields */}
              {form.category === 'Employment' && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Employer name
                    </label>
                    <input
                      value={form.employer}
                      onChange={(e) =>
                        setForm({ ...form, employer: e.target.value })
                      }
                      placeholder="Enter employer name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Months worked
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={form.monthsWorked}
                      onChange={(e) =>
                        setForm({ ...form, monthsWorked: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Business-specific fields */}
              {form.category === 'Business' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Business name / type
                  </label>
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Enter business details"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Freelance-specific fields */}
              {form.category === 'Self-employment' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Client / Project details
                  </label>
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Enter client or project"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Rental-specific fields */}
              {form.category === 'Rental' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Property details
                  </label>
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Enter property details"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Investment-specific fields */}
              {form.category === 'Investment' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Investment source / type
                  </label>
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Enter investment source"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {form.category === 'Other' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe your income"
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Amount (LKR) *
                </label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Frequency *
                </label>
                <select
                  value={form.frequency}
                  onChange={(e) =>
                    setForm({ ...form, frequency: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option>Monthly</option>
                  <option>Annual</option>
                  <option>Variable</option>
                  <option>One-time</option>
                </select>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#2862e8] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#194fc9]"
                >
                  {editingId ? 'Save changes' : 'Save income'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default IncomeManagement
