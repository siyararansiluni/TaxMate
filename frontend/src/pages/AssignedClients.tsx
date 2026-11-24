import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENTS, STATUSES, statusClass } from "../data/clientsData";
import "../components/assignedClients.css";

export default function AssignedClients() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Statuses");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLIENTS.filter(
      (c) =>
        (status === "All Statuses" || c.status === status) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.nic.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q))
    );
  }, [query, status]);

  return (
    <div className="ac">
      <h1 className="text-[28px] font-bold text-slate-900">Assigned Clients</h1>
      <p className="ac-sub">View and manage the taxpayers assigned to you.</p>

      <div className="ac-card ac-filters">
        <div className="ac-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Search by name, NIC or email..."
            aria-label="Search clients"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="acStatus">Status</label>
          <select id="acStatus" className="ac-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ac-card ac-tablewrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Client Name</th>
              <th>NIC</th>
              <th>Contact Email</th>
              <th>Last Activity</th>
              <th>Tax Return Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="ac-empty">No clients match your search.</td>
              </tr>
            )}
            {rows.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>{c.nic}</td>
                <td>{c.email}</td>
                <td>
                  {c.lastActivityDate}
                  <br />
                  {c.lastActivityText}
                </td>
                <td>
                  <span className={`ac-pill ${statusClass(c.status)}`}>{c.status}</span>
                </td>
                <td>
                  <button className="ac-btn sm" onClick={() => navigate(`/advisor/clients/${c.id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}