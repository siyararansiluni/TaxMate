import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CLIENTS, STATUSES, STATUS_HELP, lkr, statusClass } from "../data/clientsData";
import type { TaxStatus } from "../data/clientsData";
import "../components/assignedClients.css";

function UpdateStatusModal({
  name,
  current,
  onClose,
  onSave,
}: {
  name: string;
  current: TaxStatus;
  onClose: () => void;
  onSave: (s: TaxStatus, note: string) => void;
}) {
  const [value, setValue] = useState<TaxStatus>(current);
  const [note, setNote] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ac-overlay" onClick={onClose}>
      <div className="ac-modal" role="dialog" aria-modal="true" aria-labelledby="acModalTitle" onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <h3 id="acModalTitle">Update status</h3>
            <small className="ac-muted">{name} · 2025 / 2026</small>
          </div>
          <button className="x" onClick={onClose} aria-label="Close">×</button>
        </header>

        {STATUSES.map((s) => (
          <label key={s} className="ac-opt">
            <input type="radio" name="taxStatus" checked={value === s} onChange={() => setValue(s)} />
            <span className={`ac-pill ${statusClass(s)}`} style={{ fontSize: 10, padding: "2px 10px" }}>{s}</span>
            <span className="help">{STATUS_HELP[s]}</span>
            {s === current && <span className="cur">Current</span>}
          </label>
        ))}

        <label className="n" htmlFor="acNote">Note (optional)</label>
        <input id="acNote" type="text" placeholder="Add a short note about this change..." value={note} onChange={(e) => setNote(e.target.value)} />

        <footer>
          <button className="ac-btn" onClick={onClose}>Cancel</button>
          <button className="ac-btn primary" onClick={() => onSave(value, note)}>Save status</button>
        </footer>
      </div>
    </div>
  );
}

export default function ClientDetail() {
  const { clientId } = useParams();
  const client = CLIENTS.find((c) => c.id === clientId);

  const [status, setStatus] = useState<TaxStatus>(client?.status ?? "Not Started");
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  if (!client) {
    return (
      <div className="ac">
        <Link to="/advisor/clients" className="ac-back">← Back to assigned clients</Link>
        <p className="ac-sub" style={{ marginTop: 16 }}>Client not found.</p>
      </div>
    );
  }

  const initials = client.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const taxable = Math.max(client.totalIncome - client.reliefs, 0);

  const stats = [
    ["Total income", lkr(client.totalIncome)],
    ["Reliefs and deductions", lkr(client.reliefs)],
    ["Taxable income", lkr(taxable)],
    ["Estimated tax", lkr(client.estimatedTax)],
  ];

  return (
    <div className="ac">
      <div className="ac-top">
        <Link to="/advisor/clients" className="ac-back">← Back to assigned clients</Link>
        <div style={{ display: "flex", gap: 10 }}>
          <a
  className="ac-btn primary"
  href={`mailto:${client.email}`}
  style={{ textDecoration: "none" }}
>
  Message Client
</a>
          <button className="ac-btn primary" onClick={() => setOpen(true)}>Update Status</button>
        </div>
      </div>

      <div className="ac-hero">
        <div className="ac-avatar">{initials}</div>
        <div>
          <h1>
            {client.name} <span className={`ac-pill ${statusClass(status)}`}>{status}</span>
          </h1>
          <small>{client.email} · Assessment year 2025 / 2026</small>
        </div>
      </div>

      <div className="ac-stats">
        {stats.map(([label, value]) => (
          <div key={label} className="ac-card">
            <small>{label}</small>
            <b>{value}</b>
          </div>
        ))}
      </div>

      <div className="ac-cols">
        <div className="ac-col">
          <section className="ac-card">
            <h2>Client information</h2>
            <div className="ac-info">
              {[
                ["NIC", client.nic],
                ["TIN", client.tin],
                ["Phone", client.phone],
                ["Email", client.email],
                ["Last activity", client.lastActivityDate],
                ["Assigned on", client.assignedOn],
              ].map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
            </div>
          </section>

          <section className="ac-card ac-tablewrap">
            <h2 style={{ padding: "14px 14px 0" }}>Income details</h2>
            <table className="ac-mini">
              <thead>
                <tr><th>Source</th><th>Amount (LKR)</th><th>Status</th></tr>
              </thead>
              <tbody>
                {client.income.length === 0 && (
                  <tr><td colSpan={3} className="ac-empty">No income details yet.</td></tr>
                )}
                {client.income.map((r) => (
                  <tr key={r.source}>
                    <td>{r.source}</td>
                    <td>{r.amount.toLocaleString("en-US")}</td>
                    <td><span className={`ac-pill ${statusClass(r.status)}`} style={{ fontSize: 10, padding: "3px 10px" }}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="ac-col">
          <section className="ac-card">
            <h2>Documents</h2>
            {client.documents.length === 0 && <small>No documents uploaded.</small>}
            <ul className="ac-docs">
              {client.documents.map((d) => (
                <li key={d.name}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{d.name}</div>
                    <small>Uploaded {d.uploaded}</small>
                  </div>
                  <div className="r">
                    <span className={`ac-pill ${statusClass(d.status)}`}>{d.status}</span>
                    <button className="ac-btn sm">View</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="ac-card">
            <h2>Recent activity</h2>
            <ul className="ac-timeline">
              {client.activity.map((a) => (
                <li key={a.text + a.date}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{a.text}</div>
                    <small>{a.date}</small>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="ac-card ac-notes-card" style={{ marginTop: 16 }}>
        <h2>Advisor notes</h2>
        <div className="ac-notes" style={{ marginTop: 0 }}>
          <input
            type="text"
            placeholder="Add a private note about this client..."
            aria-label="Advisor note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            className="ac-btn primary"
            disabled={!note.trim()}
            onClick={() => {
              // TODO: save note via API
              setNote("");
            }}
          >
            Save note
          </button>
        </div>
      </section>

      {open && (
        <UpdateStatusModal
          name={client.name}
          current={status}
          onClose={() => setOpen(false)}
          onSave={(s) => {
            // TODO: send { clientId, status: s, note } to your API
            setStatus(s);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}