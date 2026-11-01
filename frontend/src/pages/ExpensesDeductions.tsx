
import { useMemo, useState, type FormEvent } from 'react'

type Expense = {
  id: number
  category: string
  description: string
  amount: number
  date: string
  year: string
  eligibility: string
  documentRef?: string
}

const initialExpenses: Expense[] = [
  {
    id: 1,
    category: 'Business Expenses',
    description: 'Office supplies and equipment',
    amount: 45000,
    date: '2026-04-10',
    year: '2025 / 2026',
    eligibility: 'Not Evaluated',
    documentRef: 'INV-001',
  },
  {
    id: 2,
    category: 'Employment Expenses',
    description: 'Work-related travel expenses',
    amount: 18000,
    date: '2026-05-15',
    year: '2025 / 2026',
    eligibility: 'Potentially Eligible',
  },
  {
    id: 3,
    category: 'Rental Expenses',
    description: 'Property maintenance',
    amount: 25000,
    date: '2026-06-05',
    year: '2025 / 2026',
    eligibility: 'Not Evaluated',
  },
]

const expenseCategories = [
  'Business Expenses',
  'Employment Expenses',
  'Freelance Expenses',
  'Rental Expenses',
  'Investment Expenses',
  'Other',
]

const eligibilityOptions = [
  'Not Evaluated',
  'Potentially Eligible',
  'Eligible',
  'Not Eligible',
]

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-LK').format(amount)

function ExpensesDeductions() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('2025 / 2026')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    category: 'Business Expenses',
    description: '',
    amount: '',
    date: '',
    eligibility: 'Not Evaluated',
    documentRef: '',
  })

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesYear = expense.year === selectedYear

      const matchesSearch =
        expense.description.toLowerCase().includes(search.toLowerCase()) ||
        expense.category.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' ||
        expense.category === selectedCategory

      return matchesYear && matchesSearch && matchesCategory
    })
  }, [expenses, selectedYear, search, selectedCategory])

  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )

  const eligibleExpenses = filteredExpenses
    .filter((expense) => expense.eligibility === 'Eligible')
    .reduce((total, expense) => total + expense.amount, 0)

  const openAddModal = () => {
    setEditingId(null)
    setForm({
      category: 'Business Expenses',
      description: '',
      amount: '',
      date: '',
      eligibility: 'Not Evaluated',
      documentRef: '',
    })
    setError('')
    setShowModal(true)
  }

  const openEditModal = (expense: Expense) => {
    setEditingId(expense.id)
    setForm({
      category: expense.category,
      description: expense.description,
      amount: String(expense.amount),
      date: expense.date,
      eligibility: expense.eligibility,
      documentRef: expense.documentRef || '',
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const amount = Number(form.amount)

    if (!form.description.trim()) {
      setError('Please enter an expense description.')
      return
    }

    if (!form.amount || !Number.isFinite(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than zero.')
      return
    }

    if (!form.date) {
      setError('Please select the expense date.')
      return
    }

    const updatedExpense: Expense = {
      id: editingId ?? Date.now(),
      category: form.category,
      description: form.description.trim(),
      amount,
      date: form.date,
      year: selectedYear,
      eligibility: form.eligibility,
      documentRef: form.documentRef.trim(),
    }

    if (editingId !== null) {
      setExpenses((previous) =>
        previous.map((expense) =>
          expense.id === editingId ? updatedExpense : expense
        )
      )
    } else {
      setExpenses((previous) => [...previous, updatedExpense])
    }

    setShowModal(false)
    setError('')
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Eligible':
        return 'bg-green-50 text-green-700'
      case 'Potentially Eligible':
        return 'bg-blue-50 text-blue-700'
      case 'Not Eligible':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-full bg-white px-5 py-6 sm:px-8 lg:px-10">

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#203448] sm:text-[26px]">
          Expenses & Deductions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Record your expenses and manage potential tax deductions.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-[#b8cce5] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Total recorded expenses</p>
          <h2 className="mt-3 text-xl font-bold text-[#203448]">
            LKR {formatMoney(totalExpenses)}
          </h2>
          <p className="mt-2 text-[11px] text-[#5b9f9c]">
            {selectedYear}
          </p>
        </div>

        <div className="rounded-xl border border-[#b8cce5] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Eligible expenses recorded</p>
          <h2 className="mt-3 text-xl font-bold text-[#203448]">
            LKR {formatMoney(eligibleExpenses)}
          </h2>
          <p className="mt-2 text-[11px] text-[#5b9f9c]">
            Marked as eligible
          </p>
        </div>

        <div className="rounded-xl border border-[#b8cce5] bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Expense records</p>
          <h2 className="mt-3 text-xl font-bold text-[#203448]">
            {String(filteredExpenses.length).padStart(2, '0')}
          </h2>
          <p className="mt-2 text-[11px] text-[#5b9f9c]">
            Across categories
          </p>
        </div>

      </div>

      {/* Expense records heading and Add button */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-base font-bold text-[#263b4d]">
          Expense records
        </h2>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-[#2862e8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#194fc9]"
        >
          + Add expense
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

        <input
          type="text"
          placeholder="Search expenses..."
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

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-[#c5d3e5] bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">All categories</option>
          {expenseCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

      </div>

      {/* Expense table */}
      <div className="overflow-x-auto rounded-xl border border-[#b8cce5] shadow-sm">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-[#edf4ff]">
            <tr className="text-xs font-semibold text-[#40546a]">
              <th className="px-4 py-3.5">Expense description</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Amount (LKR)</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Eligibility</th>
              <th className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredExpenses.map((expense) => (
              <tr
                key={expense.id}
                className="text-xs text-gray-600 transition hover:bg-blue-50/40"
              >
                <td className="px-4 py-4 font-medium text-[#34485a]">
                  {expense.description}
                  {expense.documentRef && (
                    <p className="mt-1 text-[10px] text-gray-400">
                      Ref: {expense.documentRef}
                    </p>
                  )}
                </td>

                <td className="px-4 py-4">{expense.category}</td>

                <td className="px-4 py-4">
                  {formatMoney(expense.amount)}
                </td>

                <td className="px-4 py-4">{expense.date}</td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusStyle(expense.eligibility)}`}
                  >
                    {expense.eligibility}
                  </span>
                </td>

                {/* Edit only - Delete icon removed */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => openEditModal(expense)}
                      title="Edit expense"
                      className="text-lg text-gray-600 hover:text-blue-600"
                    >
                      ✎
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredExpenses.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  No expense records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Note: Recording an expense does not automatically make it a tax deduction.
        Eligibility should be assessed using verified tax rules.
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

            {/* Modal heading */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#203448]">
                  {editingId ? 'Edit expense' : 'Add expense'}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your expense details below.
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

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Expense category *
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description *
                </label>

                <input
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Enter expense description"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Amount */}
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

              {/* Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Expense date *
                </label>

                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Document reference */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Document reference (Optional)
                </label>

                <input
                  value={form.documentRef}
                  onChange={(e) =>
                    setForm({ ...form, documentRef: e.target.value })
                  }
                  placeholder="Enter receipt or document reference"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Eligibility */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Deduction eligibility
                </label>

                <select
                  value={form.eligibility}
                  onChange={(e) =>
                    setForm({ ...form, eligibility: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {eligibilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Buttons */}
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
                  {editingId ? 'Save changes' : 'Save expense'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default ExpensesDeductions
