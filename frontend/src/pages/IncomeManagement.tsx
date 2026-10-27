
import { useMemo, useState } from 'react'
import TaxMateLayout from '../components/TaxMateLayout'

type Income = {
  id: number
  source: string
  category: string
  amount: number
  frequency: string
}

const initialIncome: Income[] = [
  { id: 1, source: 'Monthly salary', category: 'Employment', amount: 1800000, frequency: 'Monthly' },
  { id: 2, source: 'Freelance projects', category: 'Self-employment', amount: 450000, frequency: 'Variable' },
  { id: 3, source: 'Rental property', category: 'Rental', amount: 240000, frequency: 'Monthly' },
  { id: 4, source: 'Investment returns', category: 'Investment', amount: 110000, frequency: 'Annual' },
]

const money = (amount: number) =>
  `LKR ${amount.toLocaleString('en-US')}`

export default function IncomeManagement() {
  const [records, setRecords] = useState(initialIncome)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Income | null>(null)
  const [source, setSource] = useState('')
  const [category, setCategory] = useState('Employment')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('Monthly')
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      records.filter((item) =>
        `${item.source} ${item.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [records, search]
  )

  const total = records.reduce((sum, item) => sum + item.amount, 0)

  function openAdd() {
    setEditing(null)
    setSource('')
    setCategory('Employment')
    setAmount('')
    setFrequency('Monthly')
    setShowForm(true)
  }

  function openEdit(item: Income) {
    setEditing(item)
    setSource(item.source)
    setCategory(item.category)
    setAmount(String(item.amount))
    setFrequency(item.frequency)
    setShowForm(true)
  }

  function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = Number(amount)

    if (!source.trim() || !Number.isFinite(value) || value <= 0) return

    if (editing) {
      setRecords((old) =>
        old.map((item) =>
          item.id === editing.id
            ? { ...item, source: source.trim(), category, amount: value, frequency }
            : item
        )
      )
    } else {
      setRecords((old) => [
        ...old,
        { id: Date.now(), source: source.trim(), category, amount: value, frequency },
      ])
    }

    setShowForm(false)
  }

  return (
    <TaxMateLayout title="Income Management">
      <div className="page-heading">
        <div>
          <h1>Income Management</h1>
          <p className="page-subtitle">
            Track and manage your income sources for the selected tax year.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <span className="summary-label">Total recorded income</span>
          <strong>{money(total)}</strong>
          <span className="summary-note">2025 / 2026</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Income sources</span>
          <strong>{String(records.length).padStart(2, '0')}</strong>
          <span className="summary-note">Across categories</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Last updated</span>
          <strong>Oct 2026</strong>
          <span className="summary-note">Demo data</span>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <h2>Income records</h2>
          <p>Review your recorded income sources.</p>
        </div>
        <button className="primary-button" onClick={openAdd}>
          + Add income
        </button>
      </div>

      <div className="table-tools">
        <label className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search income sources"
          />
        </label>
        <span className="record-count">{filtered.length} records</span>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Income source</th>
                <th>Category</th>
                <th>Amount (LKR)</th>
                <th>Frequency</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><span className="record-name">{item.source}</span></td>
                  <td><span className="category-tag">{item.category}</span></td>
                  <td className="amount-cell">{item.amount.toLocaleString('en-US')}</td>
                  <td>{item.frequency}</td>
                  <td>
                    <button className="icon-button" title="Edit" onClick={() => openEdit(item)}>✎</button>
                    <button
                      className="icon-button delete-icon"
                      title="Delete"
                      onClick={() => {
                        if (window.confirm(`Delete ${item.source}?`)) {
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
                <tr><td colSpan={5} className="empty-state">No income sources found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="page-tip">
        Record each income source accurately to support your tax calculation.
      </p>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowForm(false)
        }}>
          <section className="modal" role="dialog" aria-modal="true">
            <div className="modal-heading">
              <h2>{editing ? 'Edit income' : 'Add income source'}</h2>
              <button className="modal-close" type="button" onClick={() => setShowForm(false)}>×</button>
            </div>

            <form onSubmit={saveRecord}>
              <label className="form-field">
                Income source
                <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Monthly salary" required />
              </label>

              <label className="form-field">
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Employment</option>
                  <option>Self-employment</option>
                  <option>Rental</option>
                  <option>Investment</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="form-field">
                Amount (LKR)
                <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required />
              </label>

              <label className="form-field">
                Frequency
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option>Monthly</option>
                  <option>Annual</option>
                  <option>Variable</option>
                  <option>One-time</option>
                </select>
              </label>

              <p className="form-hint">Demo data only. Changes are not permanently stored.</p>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">{editing ? 'Save changes' : 'Add income'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </TaxMateLayout>
  )
}
