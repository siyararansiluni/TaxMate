
import { useMemo, useState } from 'react'
import TaxMateLayout from '../components/TaxMateLayout'

type Expense = {
  id: number
  description: string
  category: string
  amount: number
  review: string
}

const initialExpenses: Expense[] = [
  { id: 1, description: 'Professional course', category: 'Education', amount: 65000, review: 'Review eligibility' },
  { id: 2, description: 'Medical insurance', category: 'Insurance', amount: 80000, review: 'Review eligibility' },
  { id: 3, description: 'Business equipment', category: 'Business', amount: 120000, review: 'Review eligibility' },
  { id: 4, description: 'Other expenses', category: 'Other', amount: 155000, review: 'Not classified' },
]

const money = (amount: number) =>
  `LKR ${amount.toLocaleString('en-US')}`

export default function ExpensesDeductions() {
  const [records, setRecords] = useState(initialExpenses)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Education')
  const [amount, setAmount] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      records.filter((item) =>
        `${item.description} ${item.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [records, search]
  )

  const total = records.reduce((sum, item) => sum + item.amount, 0)

  // Illustrative demo figure, not an actual tax deduction calculation.
  const potentialDeductions = records
    .filter((item) => item.review === 'Review eligibility')
    .reduce((sum, item) => sum + item.amount, 0)

  const itemsToReview = records.filter(
    (item) => item.review === 'Review eligibility'
  ).length

  function openAdd() {
    setEditing(null)
    setDescription('')
    setCategory('Education')
    setAmount('')
    setShowForm(true)
  }

  function openEdit(item: Expense) {
    setEditing(item)
    setDescription(item.description)
    setCategory(item.category)
    setAmount(String(item.amount))
    setShowForm(true)
  }

  function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = Number(amount)

    if (!description.trim() || !Number.isFinite(value) || value <= 0) return

    const updated: Expense = {
      id: editing?.id ?? Date.now(),
      description: description.trim(),
      category,
      amount: value,
      review: category === 'Other' ? 'Not classified' : 'Review eligibility',
    }

    if (editing) {
      setRecords((old) =>
        old.map((item) => item.id === editing.id ? updated : item)
      )
    } else {
      setRecords((old) => [...old, updated])
    }

    setShowForm(false)
  }

  return (
    <TaxMateLayout title="Expenses & Deductions">
      <div className="page-heading">
        <div>
          <h1>Expenses &amp; Deductions</h1>
          <p className="page-subtitle">
            Record expenses and review possible tax deductions.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <span className="summary-label">Recorded expenses</span>
          <strong>{money(total)}</strong>
          <span className="summary-note">All recorded categories</span>
        </article>

        <article className="summary-card">
          <span className="summary-label">Potential deductions</span>
          <strong>{money(potentialDeductions)}</strong>
          <span className="summary-note">Requires eligibility review</span>
        </article>

        <article className="summary-card">
          <span className="summary-label">Items to review</span>
          <strong>{String(itemsToReview).padStart(2, '0')}</strong>
          <span className="summary-note">Not yet verified</span>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <h2>Expense records</h2>
          <p>Manage your expenses and review their classification.</p>
        </div>
        <button className="primary-button" onClick={openAdd}>
          + Add expense
        </button>
      </div>

      <div className="table-tools">
        <label className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search expenses"
          />
        </label>
        <span className="record-count">{filtered.length} records</span>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Amount (LKR)</th>
                <th>Deduction review</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><span className="record-name">{item.description}</span></td>
                  <td><span className="category-tag">{item.category}</span></td>
                  <td className="amount-cell">{item.amount.toLocaleString('en-US')}</td>
                  <td>
                    <span className={item.review === 'Not classified' ? 'review-tag neutral' : 'review-tag'}>
                      {item.review}
                    </span>
                  </td>
                  <td>
                    <button className="icon-button" title="Edit" onClick={() => openEdit(item)}>✎</button>
                    <button
                      className="icon-button delete-icon"
                      title="Delete"
                      onClick={() => {
                        if (window.confirm(`Delete ${item.description}?`)) {
                          setRecords((old) => old.filter((row) => row.id !== item.id))
                        }
                      }}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr><td colSpan={5} className="empty-state">No expenses found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="page-tip">
        Deductibility depends on applicable Sri Lankan tax rules. Verify eligibility before claiming any amount.
      </p>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowForm(false)
        }}>
          <section className="modal" role="dialog" aria-modal="true">
            <div className="modal-heading">
              <h2>{editing ? 'Edit expense' : 'Add expense'}</h2>
              <button className="modal-close" type="button" onClick={() => setShowForm(false)}>×</button>
            </div>

            <form onSubmit={saveRecord}>
              <label className="form-field">
                Description
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="e.g. Professional course"
                  required
                />
              </label>

              <label className="form-field">
                Category
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option>Education</option>
                  <option>Insurance</option>
                  <option>Business</option>
                  <option>Travel</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="form-field">
                Amount (LKR)
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </label>

              <p className="form-hint">
                This is a frontend demo. Recording an expense does not mean it qualifies for a tax deduction.
              </p>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editing ? 'Save changes' : 'Add expense'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </TaxMateLayout>
  )
}
