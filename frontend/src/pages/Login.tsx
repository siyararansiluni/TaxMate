
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

type Role = "taxpayer" | "advisor" | "admin";

type DemoUser = {
  email: string;
  password: string;
  role: string;
  label: string;
  destination: string;
};

const demoUsers: Record<Role, DemoUser> = {
  taxpayer: {
    email: "taxpayer@taxmate.com",
    password: "taxpayer123",
    role: "TAXPAYER",
    label: "TaxPayer",
    destination: "/taxpayer/dashboard",
  },
  advisor: {
    email: "advisor@taxmate.com",
    password: "advisor123",
    role: "TAX_ADVISOR",
    label: "Advisor",
    destination: "/advisor/dashboard",
  },
  admin: {
    email: "admin@taxmate.com",
    password: "admin123",
    role: "ADMIN",
    label: "Admin",
    destination: "/admin/users",
  },
};

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function login(selectedRole?: Role) {
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    const user = selectedRole
      ? demoUsers[selectedRole]
      : Object.values(demoUsers).find(
          (item) =>
            item.email === normalizedEmail &&
            item.password === password
        );

    if (!user) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Demo-only login; this is not real authentication.
    navigate(user.destination, {
      state: {
        role: user.role,
        email: user.email,
        label: user.label,
      },
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login();
  }

  function useDemo(role: Role) {
    const user = demoUsers[role];

    setEmail(user.email);
    setPassword(user.password);
    setError("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <section className="w-full max-w-[360px] rounded-2xl border border-blue-400 bg-white px-7 py-5 shadow-sm sm:px-[34px]">
        <h1 className="mb-3 text-xl font-bold tracking-tight text-black">
          Tax<span className="text-teal-600">Mate</span>
        </h1>

        <h2 className="text-xl font-bold text-gray-950">
          Welcome Back
        </h2>

        <p className="mb-4 text-xs text-gray-600">
          Sign into your account or explore a demo
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-semibold text-gray-900"
            >
              Email Address *
            </label>

            <input
              id="email"
              type="email"
              placeholder="kamal@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-semibold text-gray-900"
            >
              Password *
            </label>

            <div className="flex items-center rounded-lg border border-slate-200 pr-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="min-w-0 flex-1 rounded-lg px-3 py-2.5 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-gray-600 hover:text-blue-600"
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9 7-.2 1.1-1 2.4-2.2 3.6" />
                    <path d="M6.2 6.2C3.8 7.7 2.3 10 2 12c.5 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-xs text-gray-600">
          New to TaxMate?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>

        <Link
          to="/"
          className="mt-4 inline-block text-xs text-gray-800 hover:text-blue-600"
        >
          &larr; Back to home
        </Link>

        <div className="mt-5 rounded-lg bg-slate-100 p-3">
          <p className="mb-3 text-xs font-medium text-gray-800">
            Demo access (no real authentication):
          </p>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(demoUsers) as Role[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => useDemo(role)}
                className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-blue-100"
              >
                {demoUsers[role].label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
            Select a role to fill in its demo credentials, then click Login.
            Or use one of the direct demo buttons below.
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {(Object.keys(demoUsers) as Role[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => login(role)}
                className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
              >
                Continue as {demoUsers[role].label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
