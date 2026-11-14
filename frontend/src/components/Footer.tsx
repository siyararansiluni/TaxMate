function Footer() {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-slate-200 bg-white px-4 py-2 text-[11px] text-slate-500 sm:px-6">
      <p>© {new Date().getFullYear()} TaxMate. All rights reserved.</p>
      <p className="hidden sm:block">TaxMate • Sri Lanka</p>
    </footer>
  )
}

export default Footer