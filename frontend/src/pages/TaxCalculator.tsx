

import { useState } from "react";

function TaxCalculator() {
  const [assessmentYear, setAssessmentYear] = useState("2025/2026");
  const [income, setIncome] = useState({
  employee: "",
  business: "",
  investment: "",
  other: "",
});

const totalIncome =
  Number(income.employee || 0) +
  Number(income.business || 0) +
  Number(income.investment || 0) +
  Number(income.other || 0);

  const [deductions, setDeductions] = useState({
  donations: "",
  insurance: "",
  medical: "",
  other: "",
});

const [apitWithheld, setApitWithheld] = useState("");

const totalDeductions =
  Number(deductions.donations || 0) +
  Number(deductions.insurance || 0) +
  Number(deductions.medical || 0) +
  Number(deductions.other || 0);

const taxableIncome = Math.max(0, totalIncome - totalDeductions);
const [estimatedTax, setEstimatedTax] = useState<number | null>(null);
const [error, setError] = useState("");
const [successMessage, setSuccessMessage] = useState("");

  return (
    <main className="min-h-screen bg-white px-5 py-6 sm:px-7">
      <div className="mx-auto max-w-6xl">

        

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Tax Calculator
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Estimate your tax based on recorded information and selected rules.
          </p>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">

          {/* Left: Calculation inputs */}
          <section className="rounded-xl border border-blue-400 bg-white p-5">
            <h2 className="mb-5 text-base font-semibold text-slate-800">
              Calculation inputs
            </h2>

            <label className="mb-5 block text-xs text-slate-600">
              Assessment year

              <select
  value={assessmentYear}
  onChange={(e) => setAssessmentYear(e.target.value)}
  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm text-slate-700 outline-none focus:border-blue-500"
>
  <option value="2025/2026">2025 / 2026</option>
  <option value="2024/2025">2024 / 2025</option>
  <option value="2023/2024">2023 / 2024</option>
</select>
            </label>

            <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">
                Income Details
              </h3>
            </div>

            <div className="space-y-3">
              {[
               { label: "Employee Income", key: "employee" as const },
               { label: "Business Income", key: "business" as const },
               { label: "Investment Income", key: "investment" as const },
               { label: "Other Income", key: "other" as const },
               ].map(({ label, key }) => (
                <div
                  key={label}
                  className="grid grid-cols-2 items-center gap-3 text-xs text-slate-600"
                >
                  <span>{label}</span>

                  <div className="flex overflow-hidden rounded-lg border border-slate-200">
                    <span className="bg-slate-100 px-2 py-2.5 text-slate-500">
                      LKR
                    </span>
                  <input
                   type="number"
                   min="0"
                   placeholder="0.00"
                   value={income[key]}
                   onChange={(e) =>
                   setIncome((prev) => ({
                   ...prev,
                  [key]: e.target.value,
                 }))
               }
                className="w-full min-w-0 flex-1 bg-white px-2 py-2.5 text-right text-xs text-slate-700 outline-none focus:bg-blue-50"
              />
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4 mt-6 rounded-lg bg-blue-50 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">
                Eligible deductions
              </h3>
            </div>

            <div className="space-y-3">
              
            {[
              { label: "Qualifying Donations", key: "donations" as const },
              { label: "Life Insurance premium", key: "insurance" as const },
              { label: "Medical Expenses", key: "medical" as const },
              { label: "Other Deductions", key: "other" as const },
             ].map(({ label, key }) => (
            <div
             key={key}
             className="grid grid-cols-2 items-center gap-3 text-xs text-slate-600"
             >
    <span>{label}</span>

    <div className="flex overflow-hidden rounded-lg border border-slate-200">
      <span className="bg-slate-100 px-2 py-2.5 text-slate-500">
        LKR
      </span>

      <input
        type="number"
        min="0"
        placeholder="0.00"
        value={deductions[key]}
        onChange={(e) =>
          setDeductions((prev) => ({
            ...prev,
            [key]: e.target.value,
          }))
        }
        className="w-full min-w-0 flex-1 bg-white px-2 py-2.5 text-right text-xs text-slate-700 outline-none focus:bg-blue-50"
      />
    </div>
  </div>
))}

              
            </div>
<div className="mt-6">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    APIT / Tax Withheld
  </label>

  <div className="flex overflow-hidden rounded-lg border border-slate-200">
    <span className="bg-slate-100 px-3 py-2.5 text-sm text-slate-500">
      LKR
    </span>

    <input
      type="number"
      min="0"
      placeholder="Enter APIT amount"
      value={apitWithheld}
      onChange={(e) => setApitWithheld(e.target.value)}
      className="w-full min-w-0 flex-1 bg-white px-3 py-2.5 text-right text-sm outline-none focus:bg-blue-50"
    />
  </div>

  <p className="mt-1 text-xs text-slate-500">
    Enter the tax already deducted or withheld.
  </p>
</div>
{error && (
  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
    {error}
  </p>
)}
{successMessage && (
  <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
    {successMessage}
  </p>
)}
          <button
            type="button"
           onClick={() => {
  const allValues = [
    ...Object.values(income),
    ...Object.values(deductions),
    apitWithheld,
  ];
  const isEmpty = allValues.every(
  (value) => value === ""
);

if (isEmpty) {
  setError("Please enter your income details.");
  setSuccessMessage("");
  setEstimatedTax(null);
  return;
}

  const hasInvalidValue = allValues.some(
    (value) => value !== "" && Number(value) < 0
  );

  if (hasInvalidValue) {
    setError("Please enter valid non-negative amounts.");
    setSuccessMessage("");
    setEstimatedTax(null);
    return;
  }

  setError("");
  setSuccessMessage("Tax estimate calculated successfully.");

  // Temporary demo calculation only
  const tax = taxableIncome * 0.1;
  setEstimatedTax(tax);
}}
           
           className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
           Calculate estimated tax
          </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              This is an illustrative estimate, not an official IRD assessment.
            </p>
          </section>

          {/* Right: Summary and tax rules */}
          <div className="space-y-5">

            <section className="rounded-xl border border-blue-400 bg-white p-5">
              <h2 className="mb-5 text-base font-semibold text-slate-800">
                Estimated tax summary
              </h2>

            
{[
  "Gross income",
  "Deductions",
  "Taxable income",
  "APIT / Tax Withheld",
  "Remaining Tax",
]
.map((label) => {
  const amount =
  label === "Gross income"
    ? totalIncome
    : label === "Deductions"
    ? totalDeductions
    : label === "Taxable income"
    ? taxableIncome
    : label === "APIT / Tax Withheld"
    ? Number(apitWithheld || 0)
    : Math.max(
        0,
        (estimatedTax ?? 0) - Number(apitWithheld || 0)
      );

  return (
    <div
      key={label}
      className="flex items-center justify-between gap-3 border-b border-slate-100 py-3"
    >
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700">
        {`LKR ${amount.toLocaleString("en-LK", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
      </span>
    </div>
  );
})}


              <div className="mt-4 rounded-lg bg-blue-50 p-5">
  <p className="text-xs text-slate-500">
    Estimated Tax
  </p>

  <p className="mt-2 text-2xl font-bold text-blue-600">
    {estimatedTax === null
      ? "Calculate to view"
      : `LKR ${estimatedTax.toLocaleString("en-LK", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
  </p>

  <div className="mt-4 space-y-3 border-t border-blue-200 pt-4">
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">APIT / Tax Withheld</span>
      <span className="font-medium text-slate-700">
        LKR {Number(apitWithheld || 0).toLocaleString("en-LK")}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="font-semibold text-slate-700">
        Remaining Tax
      </span>
      <span className="font-bold text-blue-700">
        LKR {Math.max(
          0,
          (estimatedTax ?? 0) - Number(apitWithheld || 0)
        ).toLocaleString("en-LK")}
      </span>
    </div>
  </div>
</div>

              <button
                type="button"
                className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Prepare tax return →
              </button>
            </section>

            <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <h2 className="text-sm font-semibold text-slate-800">
                Tax Rules Applied
              </h2>

              <p className="mt-4 text-xs text-slate-600">
                Assessment Year: {assessmentYear}
              </p>

              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <p>Personal Relief: To be confirmed</p>
                <p>Applicable tax brackets and rates</p>
                <p>Eligible reliefs and deductions</p>
                <p>APIT / tax withheld</p>
              </div>
            </section>



          </div>
        </div>
      </div>
    </main>
  );
}

export default TaxCalculator;
