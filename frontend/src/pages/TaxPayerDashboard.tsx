
function TaxPayerDashboard() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#173453]">
        Dashboard
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Welcome back, Kamal! Here is your financial overview.
      </p>

      <section className="mt-8 flex flex-col gap-5 rounded-xl border border-blue-300 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#173453]">
            Complete your tax profile
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose your income sources to personalize your TaxMate experience.
          </p>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-[#173453] transition-colors hover:bg-blue-50"
        >
          Complete tax profile <span className="text-teal-600">→</span>
        </button>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-blue-200 bg-white p-5">
          <h2 className="font-semibold text-[#173453]">Total Income</h2>
          <p className="mt-2 text-sm text-slate-500">
            No income recorded yet
          </p>
        </article>

        <article className="rounded-xl border border-blue-200 bg-white p-5">
          <h2 className="font-semibold text-[#173453]">Estimated Tax</h2>
          <p className="mt-2 text-sm text-slate-500">
            Not calculated yet
          </p>
        </article>

        <article className="rounded-xl border border-blue-200 bg-white p-5">
          <h2 className="font-semibold text-[#173453]">Recorded Expenses</h2>
          <p className="mt-2 text-sm text-slate-500">
            No deductions recorded
          </p>
        </article>

        <article className="rounded-xl border border-blue-200 bg-white p-5">
          <h2 className="font-semibold text-[#173453]">Tax Return Status</h2>
          <p className="mt-2 text-sm text-slate-500">Not started</p>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[#173453]">
          Your next steps
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-blue-200 bg-white p-5">
            <p className="text-sm font-semibold text-blue-600">01</p>
            <h3 className="mt-2 font-semibold text-[#173453]">
              Add income records
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Keep all your income sources up to date.
            </p>
          </article>

          <article className="rounded-xl border border-blue-200 bg-white p-5">
            <p className="text-sm font-semibold text-blue-600">02</p>
            <h3 className="mt-2 font-semibold text-[#173453]">
              Review deductions
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Identify deductible expenses.
            </p>
          </article>

          <article className="rounded-xl border border-blue-200 bg-white p-5">
            <p className="text-sm font-semibold text-blue-600">03</p>
            <h3 className="mt-2 font-semibold text-[#173453]">
              Prepare your return
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Create a draft and validate it.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default TaxPayerDashboard;
