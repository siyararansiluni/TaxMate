function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} TaxMate • Sri Lanka</p>
        <nav aria-label="Footer" className="flex gap-4">
          <a href="#" className="hover:text-slate-800">Privacy Policy</a>
          <a href="#" className="hover:text-slate-800">Terms</a>
          <a href="#" className="hover:text-slate-800">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;