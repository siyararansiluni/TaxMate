interface TopBarProps {
  page: string;
  year?: string;
  initial?: string;
}

function TopBar({ page, year = "2025 / 2026", initial = "K" }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <p className="text-[11px] text-slate-500">
        TaxMate / <span className="font-medium text-slate-700">{page}</span>
      </p>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] text-slate-600">
          {year}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          {initial}
        </span>
      </div>
    </header>
  );
}

export default TopBar;