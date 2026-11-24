import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

const SERVICES = [
  { label: "Individual Tax Consultation", short: "Tax Consultation" },
  { label: "Tax Return Preparation", short: "Return Preparation" },
  { label: "Tax Planning and Advisory", short: "Planning" },
  { label: "Income Tax Compliance", short: "Compliance" },
  { label: "Review of Tax Assessments", short: "Assessments" },
];



const MAX_ABOUT = 300;

export default function MyAdvisorProfile() {
  const [form, setForm] = useState({
    name: "S. Fernando",
    email: "advisor@example.com",
    phone: "077 187 6453",
    qualification: "Chartered Accountant",
    registration: "",
    experience: "6",
    location: "Colombo, Sri Lanka",
    about:
      "Experienced tax advisor providing comprehensive tax consultation services for individuals and small businesses.",
  });
  const [selected, setSelected] = useState<string[]>([
    "Individual Tax Consultation",
    "Tax Return Preparation",
    "Tax Planning and Advisory",
  ]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showRegError, setShowRegError] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
  setForm({
    name: "S. Fernando",
    email: "advisor@example.com",
    phone: "077 187 6453",
    qualification: "Chartered Accountant",
    registration: "",
    experience: "6",
    location: "Colombo, Sri Lanka",
    about:
      "Experienced tax advisor providing comprehensive tax consultation services for individuals and small businesses.",
  });
  setSelected([
    "Individual Tax Consultation",
    "Tax Return Preparation",
    "Tax Planning and Advisory",
  ]);
  setPhoto(null);
  setDirty(false);
  if (fileRef.current) fileRef.current.value = "";
};

  const regInvalid = showRegError && !form.registration.trim();

  const initials = useMemo(
    () =>
      form.name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [form.name]
  );

  const update =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setDirty(true);
    };

  const toggleService = (label: string) => {
    setSelected((s) =>
      s.includes(label) ? s.filter((x) => x !== label) : [...s, label]
    );
    setDirty(true);
  };

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose a JPG or PNG up to 2 MB.");
      return;
    }
    setPhoto(URL.createObjectURL(file));
    setDirty(true);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.registration.trim()) {
      setShowRegError(true);
      return;
    }
    // TODO: send { ...form, services: selected } to your API here
    setDirty(false);
  };

  return (
    <>
      <style>{css}</style>
      <section className="advisor-profile">
        {/* LEFT: Professional information */}
        <form className="ap-card" onSubmit={onSubmit} noValidate>
          <h2>Professional information</h2>

          <div className="ap-upload">
            <div className="ap-avatar" aria-hidden="true">
              {photo ? (
                <img src={photo} alt="" />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              )}
            </div>
            <div>
              <button type="button" onClick={() => fileRef.current?.click()}>
                Upload profile picture
              </button>
              <small>JPG or PNG, up to 2 MB</small>
            </div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onPhoto} />
          </div>

          <div className="ap-row">
            <div>
              <label htmlFor="apName">Full name</label>
              <input id="apName" type="text" value={form.name} onChange={update("name")} />
            </div>
            <div>
              <label htmlFor="apEmail">Email address</label>
              <input id="apEmail" type="email" value={form.email} disabled readOnly />
            </div>
          </div>

          <div className="ap-row">
            <div>
              <label htmlFor="apPhone">Phone number</label>
              <input id="apPhone" type="text" value={form.phone} onChange={update("phone")} />
            </div>
            <div>
              <label htmlFor="apQual">Qualification</label>
              <input id="apQual" type="text" value={form.qualification} onChange={update("qualification")} />
            </div>
          </div>

          <label htmlFor="apReg">
            Professional registration number <em>(private, used for verification)</em>
          </label>
          <input
            id="apReg"
            type="text"
            className={regInvalid ? "ap-invalid" : ""}
            placeholder="Enter registration number"
            value={form.registration}
            onChange={update("registration")}
            onBlur={() => setShowRegError(true)}
          />
          <p className="ap-hint">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            Locked after submission. <a href="#">Request a review to change it</a>
          </p>

          <div className="ap-row">
            <div>
              <label htmlFor="apExp">Years of experience</label>
              <input id="apExp" type="text" inputMode="numeric" value={form.experience} onChange={update("experience")} />
            </div>
            <div>
              <label htmlFor="apLoc">Location</label>
              <input id="apLoc" type="text" value={form.location} onChange={update("location")} />
            </div>
          </div>

          <label htmlFor="apAbout">
            About you <em>(shown to taxpayers)</em>
          </label>
          <textarea id="apAbout" maxLength={MAX_ABOUT} value={form.about} onChange={update("about")} />
          <div className="ap-count">
            {form.about.length} / {MAX_ABOUT}
          </div>

          <label>
            Services offered <em>(taxpayers choose from these)</em>
          </label>
          <div className="ap-services">
            {SERVICES.map((s) => (
              <label key={s.label} className="ap-service">
                <input
                  type="checkbox"
                  checked={selected.includes(s.label)}
                  onChange={() => toggleService(s.label)}
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>

          <div className="ap-actions">

            <button
    type="button"
    onClick={handleCancel}
    className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
  >
    Cancel
  </button>

            <button type="submit" className="ap-save" disabled={!dirty}>
              Save profile
            </button>
          </div>
        </form>

        {/* RIGHT: status + preview */}
        <div className="ap-side">
          <section className="ap-status">
            <h2>Profile status</h2>
            <span className="ap-badge">Pending verification</span>
            <div className="ap-bar"><i /></div>
            <p>6 of 8 details added</p>
            <p className="ap-needed">Still needed:</p>
            <ul>
              <li>Profile picture</li>
              <li>Registration number</li>
            </ul>
            <p>An administrator reviews your details before your profile appears in advisor search.</p>
            <button type="button" className="ap-outline">Review request</button>
          </section>

          <section className="ap-card">
            <h2>How taxpayers see you</h2>
            <div className="ap-preview">
              <div className="ap-who">
                <div className="ap-initials">{initials}</div>
                <div>
                  <b>{form.name}</b>
                  <small>{form.qualification}</small>
                </div>
              </div>
              <div className="ap-chips">
                <span className="ap-chip">{form.experience} years experience</span>
                <span className="ap-chip">{form.location.split(",")[0]}</span>
              </div>
              <p>{form.about}</p>
              <div className="ap-chips">
                {SERVICES.filter((s) => selected.includes(s.label)).map((s) => (
                  <span key={s.label} className="ap-tag">{s.short}</span>
                ))}
              </div>
            </div>
            <p className="ap-note">
              The Verified advisor badge appears after approval. Your registration number is never shown.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}

const css = `
.advisor-profile{
  --ap-border:#2563eb; --ap-line:#d9e0ec; --ap-field:#f6f8fb; --ap-text:#1e293b; --ap-muted:#64748b;
  --ap-blue:#2563eb; --ap-soft:#e8f0ff; --ap-err-bg:#fee9e9; --ap-err-line:#f5a3a3;
  font-family:Inter,system-ui,sans-serif; color:var(--ap-text); font-size:13px;
  display:grid; grid-template-columns:minmax(0,1.75fr) minmax(0,1fr); gap:16px; align-items:start; padding:16px;
}
.advisor-profile *{box-sizing:border-box}
.advisor-profile h2{font-size:14px;font-weight:600;margin:0 0 12px}
.advisor-profile .ap-card{background:#fff;border:1px solid var(--ap-border);border-radius:12px;padding:14px}

.advisor-profile .ap-upload{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.advisor-profile .ap-avatar{width:56px;height:56px;border-radius:50%;border:1px solid var(--ap-border);background:#fff;display:grid;place-items:center;color:var(--ap-blue);overflow:hidden}
.advisor-profile .ap-avatar img{width:100%;height:100%;object-fit:cover}
.advisor-profile .ap-upload button{all:unset;cursor:pointer;color:var(--ap-blue);font-weight:600;font-size:13px}
.advisor-profile .ap-upload button:focus-visible{outline:2px solid var(--ap-blue);outline-offset:2px}
.advisor-profile .ap-upload small{display:block;color:var(--ap-muted);font-size:11px;margin-top:3px}

.advisor-profile .ap-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px}
.advisor-profile label{display:block;font-size:11px;font-weight:500;margin-bottom:6px}
.advisor-profile label em{font-style:normal;color:var(--ap-muted)}
.advisor-profile input[type=text],.advisor-profile input[type=email],.advisor-profile textarea{
  width:100%;border:1px solid var(--ap-line);background:var(--ap-field);border-radius:6px;padding:11px 10px;font:inherit;font-size:12px;color:var(--ap-text)}
.advisor-profile input:disabled{color:var(--ap-muted);cursor:not-allowed}
.advisor-profile input:focus,.advisor-profile textarea:focus{outline:2px solid var(--ap-blue);outline-offset:1px}
.advisor-profile .ap-invalid{background:var(--ap-err-bg);border-color:var(--ap-err-line)}
.advisor-profile textarea{height:78px;resize:vertical}
.advisor-profile .ap-hint{font-size:11px;color:var(--ap-muted);margin:8px 0 14px;display:flex;align-items:center;gap:5px}
.advisor-profile .ap-hint a{color:var(--ap-blue);font-weight:600;text-decoration:none}
.advisor-profile .ap-count{text-align:right;font-size:10px;color:var(--ap-muted);margin:4px 0 14px}

.advisor-profile .ap-services{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.advisor-profile .ap-service{display:flex;align-items:center;gap:10px;margin:0;padding:12px 10px;border:1px solid var(--ap-line);border-radius:6px;background:#fff;font-size:12px;font-weight:400;cursor:pointer}
.advisor-profile .ap-service:has(input:checked){background:var(--ap-soft);border-color:var(--ap-blue)}
.advisor-profile .ap-service input{width:15px;height:15px;accent-color:var(--ap-blue);margin:0}
.advisor-profile .ap-service span{font-size:12px}
.advisor-profile .ap-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:14px}
.advisor-profile .ap-save{border:0;border-radius:8px;padding:11px 20px;font:inherit;font-size:12px;font-weight:600;color:#fff;background:var(--ap-blue);cursor:pointer}
.advisor-profile .ap-save:disabled {
  background: var(--ap-blue);
  cursor: not-allowed;
}

.advisor-profile .ap-side{display:flex;flex-direction:column;gap:20px}
.advisor-profile .ap-status{background:#fffbe6;border:1px solid #f5dc7a;border-radius:12px;padding:14px}
.advisor-profile .ap-badge{display:inline-block;background:#fcd34d;color:#4a3500;font-size:11px;font-weight:600;padding:3px 10px;border-radius:99px;margin-bottom:8px}
.advisor-profile .ap-bar{height:5px;border-radius:99px;background:#d1d5db;overflow:hidden}
.advisor-profile .ap-bar i{display:block;height:100%;width:75%;background:#14b8a6}
.advisor-profile .ap-status p{font-size:11px;color:var(--ap-muted);margin:6px 0}
.advisor-profile .ap-status .ap-needed{color:#b45309;margin-top:12px}
.advisor-profile .ap-status ul{margin:4px 0 10px 18px;padding:0;font-size:11px;color:var(--ap-text)}
.advisor-profile .ap-outline{width:100%;background:#fff;border:1px solid var(--ap-blue);color:var(--ap-blue);border-radius:8px;padding:10px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;margin-top:6px}
.advisor-profile .ap-preview{background:var(--ap-soft);border:1px solid var(--ap-blue);border-radius:10px;padding:12px;margin-top:4px}
.advisor-profile .ap-who{display:flex;gap:10px;align-items:center}
.advisor-profile .ap-initials{width:34px;height:34px;border-radius:50%;background:#fff;border:1px solid var(--ap-blue);display:grid;place-items:center;font-size:10px;font-weight:600}
.advisor-profile .ap-who b{font-size:13px;display:block}
.advisor-profile .ap-who small{color:var(--ap-muted);font-size:11px}
.advisor-profile .ap-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.advisor-profile .ap-chip{background:#fff;border:1px solid var(--ap-line);color:var(--ap-muted);border-radius:4px;padding:2px 6px;font-size:10px}
.advisor-profile .ap-tag{background:var(--ap-blue);color:#fff;border-radius:99px;padding:3px 9px;font-size:10px}
.advisor-profile .ap-preview p{margin:0;font-size:11px;line-height:1.5}
.advisor-profile .ap-note{font-size:11px;color:var(--ap-muted);margin:10px 0 0;line-height:1.5}

@media (max-width:900px){.advisor-profile{grid-template-columns:1fr}}
@media (max-width:560px){.advisor-profile .ap-row,.advisor-profile .ap-services{grid-template-columns:1fr}}
`;