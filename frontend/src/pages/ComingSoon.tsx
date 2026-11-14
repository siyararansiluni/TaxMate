import { useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../auth/session";

/**
 * Temporary page for dashboards that are not built yet
 * (Tax Advisor and Administrator). Replace it with the real page later.
 */
export default function ComingSoon({ title }: { title: string }) {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-linear-to-br from-white via-blue-50 to-blue-200 px-6 text-center text-slate-800">
      <h1 className="text-3xl font-extrabold text-[#14284b]">{title}</h1>
      <p className="max-w-md text-slate-700">
        Signed in as {session?.email}. This dashboard is still under
        development.
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full bg-blue-700 px-6 py-2.5 font-semibold text-white shadow hover:bg-blue-800"
      >
        Log out
      </button>
    </main>
  );
}