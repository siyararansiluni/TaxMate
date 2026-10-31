import { useState, type ChangeEvent, type ReactElement } from "react";

/* ---------- Types ---------- */
type FieldType = "text" | "date" | "select" | "email" | "tel";
type IconComponent = () => ReactElement;

interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

interface SectionConfig {
  title: string;
  subtitle: string;
  icon: IconComponent;
  fields: FieldConfig[];
}

type FormValues = Record<string, string>;

/* ---------- Icons (inline SVG, no extra dependency) ----------
   For pixel-exact icons: in Figma select the icon > Export > SVG,
   then paste the <path> data here. */
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const UserCircleIcon: IconComponent = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a3 3 0 110 6 3 3 0 010-6zm0 14.2a8 8 0 01-6-2.7c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a8 8 0 01-6 2.7z" />
  </svg>
);

const ContactIcon: IconComponent = () => (
  <svg {...svgProps} className="h-6 w-6">
    <circle cx="7.5" cy="9" r="2.5" />
    <path d="M3 17c.5-2.2 2.4-3.3 4.5-3.3s4 1.1 4.5 3.3" />
    <path d="M15 8h6M15 12h6M15 16h6" />
  </svg>
);

const MapPinIcon: IconComponent = () => (
  <svg {...svgProps} className="h-6 w-6">
    <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const CalendarIcon = () => (
  <svg {...svgProps} className="h-4 w-4">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg {...svgProps} className="h-4 w-4">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/* ---------- Form config (mirrors the Figma cards) ---------- */
const SECTIONS: SectionConfig[] = [
  {
    title: "Personal Information",
    subtitle: "Basic details",
    icon: UserCircleIcon,
    fields: [
      { name: "fullName", label: "Full name", required: true, placeholder: "Kamal Perera" },
      { name: "nic", label: "NIC", required: true, placeholder: "200480705694" },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "gender", label: "Gender", type: "select", required: true, options: ["Male", "Female", "Other"] },
    ],
  },
  {
    title: "Contact Information",
    subtitle: "Your contact information",
    icon: ContactIcon,
    fields: [
      { name: "email", label: "Email Address", type: "email", required: true, placeholder: "kamal@gmail.com" },
      { name: "contact", label: "Contact Number", type: "tel", required: true, placeholder: "200480705694" },
      { name: "altContact", label: "Alternative Contact Number", type: "tel", required: true, placeholder: "077 546 4562" },
      { name: "preferredContact", label: "Preferred Contact Method", type: "select", required: true, options: ["Email", "Phone", "SMS"] },
    ],
  },
  {
    title: "Address Information",
    subtitle: "Your Current Residential Address",
    icon: MapPinIcon,
    fields: [
      { name: "address1", label: "Address Line 1", required: true, placeholder: "No.123 Temple Road" },
      { name: "city", label: "City", required: true, placeholder: "Moratuwa" },
      { name: "address2", label: "Address Line 2", required: true, placeholder: "Indibedda" },
      { name: "district", label: "District", type: "select", required: true, options: ["Colombo", "Gampaha", "Kalutara"] },
      { name: "postalCode", label: "Postal Code", required: true, placeholder: "10400" },
      { name: "province", label: "Province", type: "select", required: true, options: ["Western Province", "Central Province", "Southern Province"] },
    ],
  },
  {
    title: "Tax Employment Information",
    subtitle: "Your Tax Registration and Employment Details",
    icon: MapPinIcon,
    fields: [
      { name: "tin", label: "TIN (Taxpayer Identification Number)", required: true, placeholder: "123456789" },
      { name: "residency", label: "Tax residency status", type: "select", required: true, options: ["Resident", "Non-resident"] },
      { name: "employeeStatus", label: "Employee Status", type: "select", options: ["Employed", "Self-employed", "Unemployed"] },
      { name: "employerName", label: "Employee Name", placeholder: "ABC" },
      { name: "jobTitle", label: "Job title", placeholder: "Software Engineer" },
      { name: "employerAddress", label: "Employee address", placeholder: "No. 456, Galle Road, Colombo" },
    ],
  },
];

const STEPS = [
  { title: "Personal Information", subtitle: "Basic details" },
  { title: "Personal Information", subtitle: "Address and contact" },
  { title: "Personal Information", subtitle: "Tax and employment" },
  { title: "Personal Information", subtitle: "Other Details" },
];

/* ---------- Components ---------- */
function Stepper({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-2 gap-3 rounded-xl border border-blue-500 bg-blue-50/60 px-5 py-3 md:grid-cols-4">
      {STEPS.map((step, i) => (
        <li key={i} className="flex items-center gap-2.5">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
              i === current
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-500 bg-white text-blue-600"
            }`}
          >
            {i + 1}
          </span>
          <span className="leading-tight">
            <span className="block text-xs font-semibold text-[#173453]">{step.title}</span>
            <span className="block text-[11px] text-slate-600">{step.subtitle}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

interface FieldProps {
  config: FieldConfig;
  value: string;
  onChange: (name: string, value: string) => void;
}

function Field({ config, value, onChange }: FieldProps) {
  const { name, label, type = "text", required, placeholder, options } = config;
  const id = `field-${name}`;
  const handle = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange(name, e.target.value);

  const base =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#173453]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {type === "select" ? (
        <div className="relative">
          <select id={id} value={value} onChange={handle} className={`${base} appearance-none pr-9`}>
            <option value="" disabled>
              Select
            </option>
            {options?.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
            <ChevronDownIcon />
          </span>
        </div>
      ) : type === "date" ? (
        <div className="relative">
          <input
            id={id}
            type="date"
            value={value}
            onChange={handle}
            required={required}
            className={`${base} pr-9 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-800">
            <CalendarIcon />
          </span>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={handle}
          placeholder={placeholder}
          required={required}
          className={base}
        />
      )}
    </div>
  );
}

function FormSection({
  section,
  values,
  onChange,
}: {
  section: SectionConfig;
  values: FormValues;
  onChange: (name: string, value: string) => void;
}) {
  const Icon = section.icon;
  return (
    <section className="rounded-lg border border-slate-200 bg-white pb-7 shadow-sm">
      {/* Header with divider */}
      <div className="mx-6 flex items-center gap-3 border-b border-slate-200 py-4">
        <span className="text-blue-600">
          <Icon />
        </span>
        <div className="leading-tight">
          <h2 className="text-base font-semibold text-[#173453]">{section.title}</h2>
          <p className="text-xs text-slate-500">{section.subtitle}</p>
        </div>
      </div>

      {/* Narrow inputs, wide gap between the two columns (as in Figma) */}
      <div className="grid gap-x-10 gap-y-5 px-6 pt-6 md:grid-cols-2">
        {section.fields.map((f) => (
          <Field key={f.name} config={f} value={values[f.name] ?? ""} onChange={onChange} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
function MyProfile() {
  const [values, setValues] = useState<FormValues>({
    dob: "2004-01-25",
    gender: "Male",
    preferredContact: "Email",
    district: "Colombo",
    province: "Western Province",
    residency: "Resident",
    employeeStatus: "Employed",
  });

  const handleChange = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    // TODO: validate + call API
    console.log("Submitting profile", values);
  };

  return (
      <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#173453]">Complete Tax Profile</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Manage your personal information and tax profile.
          </p>
        </div>

        <Stepper current={0} />

        {SECTIONS.map((s) => (
          <FormSection key={s.title} section={s} values={values} onChange={handleChange} />
        ))}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Save Changes
          </button>
        </div>
    </div>
  );
}

export default MyProfile;