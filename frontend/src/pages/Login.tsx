import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

type Role = "taxpayer" | "advisor" | "admin";

interface DemoUser {
  email: string;
  password: string;
  role: string;
  label: string;
  destination: string;
}

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

  const handleLogin = (selectedRole?: Role) => {
    setError("");
    const checkEmail = email.trim().toLowerCase();
    
    const user = selectedRole
      ? demoUsers[selectedRole]
      : Object.values(demoUsers).find(
          (u) => u.email === checkEmail && u.password === password
        );

    if (!user) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    navigate(user.destination, {
      state: { role: user.role, email: user.email, label: user.label },
    });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  const fillDemo = (role: Role) => {
    setEmail(demoUsers[role].email);
    setPassword(demoUsers[role].password);
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 font-sans text-slate-800">
      <section className="relative flex min-h-[600px] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        
        {/* Form Container */}
        <div className="flex w-full flex-col justify-center p-6 sm:p-10 md:w-1/2 max-h-[90vh] overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-teal-600">
              Tax<span className="text-slate-900">Mate</span>
            </h1>
            <p className="mb-4 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Tax Management
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-xs text-slate-500">Sign in to your account or explore a demo</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                placeholder="kamal@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="password">
                Password *
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white pr-3 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                      <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9 7-.2 1.1-1 2.4-2.2 3.6" />
                      <path d="M6.2 6.2C3.8 7.7 2.3 10 2 12c.5 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-2">
            <p className="text-xs text-slate-600">
              New to TaxMate?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:underline">
                Register
              </Link>
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 w-fit"
            >
              &lt; Back to home
            </Link>
          </div>

          {/* Demo Section */}
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-medium text-slate-700">Try a demo account</p>
            
            <div className="flex flex-wrap gap-2">
              {(Object.keys(demoUsers) as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => fillDemo(r)}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-blue-600"
                >
                  {demoUsers[r].label}
                </button>
              ))}
            </div>

            <p className="mt-2 text-[11px] text-slate-500">
              Pick a role to fill details, or jump straight in.
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {(Object.keys(demoUsers) as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleLogin(r)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  Continue as {demoUsers[r].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Banner */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-[#87ceeb] p-10 text-slate-900">
          <div />
          <div>
            <h2 className="mb-4 text-3xl font-extrabold uppercase tracking-wide leading-tight text-white">
              WELCOME <br />
              <span className="text-slate-900">BACK!</span>
            </h2>
            <p className="text-sm text-slate-800 font-medium leading-relaxed max-w-xs">
              We are happy to have you with us again. If you need anything, we are here to help.
            </p>
          </div>
          <div className="text-xs text-slate-700 font-medium">
            TaxMate &bull; Sri Lanka
          </div>
        </div>

      </section>
    </main>
  );
}