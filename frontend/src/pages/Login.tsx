import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authenticate } from "../data/mockUsers";
import { getSession, homePaths, saveSession } from "../auth/session";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Icon({
  children,
  className = "h-5 w-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** The blue "T" with a leaf, used as the TaxMate mark. */
function LogoMark({ className = "h-14 w-14" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id={`${id}-l`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <path
        d="M4 14 H42 L38 25 H33 V54 L21 61 V25 H10 Z"
        fill={`url(#${id}-t)`}
      />
      <path
        d="M36 22 C40 9 52 3 62 3 C62 15 53 25 36 24 Z"
        fill={`url(#${id}-l)`}
      />
    </svg>
  );
}

const features = [
  {
    label: "Calculate Your Tax",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
      </>
    ),
  },
  {
    label: "Connect with Tax Advisors",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M21 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8" />
      </>
    ),
  },
  {
    label: "File with Confidence",
    icon: (
      <>
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        <path d="M8.5 12l2.5 2.5L16 9.5" />
      </>
    ),
  },
];

/** Laptop + calculator + coins + rising chart, drawn with plain SVG. */
function Illustration() {
  const id = useId();
  const bars = [
    { x: 330, h: 90 },
    { x: 385, h: 130 },
    { x: 440, h: 100 },
    { x: 495, h: 150 },
    { x: 550, h: 185 },
  ];
  return (
    <svg
      viewBox="0 0 640 330"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full"
      role="img"
      aria-label="Laptop with a tax checklist, a calculator, coins and a rising chart"
    >
      <defs>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93c5fd" stopOpacity="0.95" />
          <stop offset="1" stopColor="#60a5fa" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* faint skyline */}
      <g fill="#93c5fd" opacity="0.4">
        <rect x="52" y="70" width="8" height="220" />
        <circle cx="56" cy="64" r="9" />
        <path d="M0 290 V250 H40 V290 Z M80 290 V245 Q110 215 140 245 V290 Z" />
        <rect x="160" y="230" width="22" height="60" />
        <rect x="190" y="205" width="26" height="85" />
      </g>

      {/* chart bars */}
      {bars.map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={300 - b.h}
          width="42"
          height={b.h}
          rx="4"
          fill={`url(#${id}-bar)`}
        />
      ))}

      {/* rising arrow */}
      <path
        d="M300 255 C380 245 450 170 505 70"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.85"
      />
      <polygon points="470,62 538,18 530,100" fill="#3b82f6" opacity="0.9" />

      {/* laptop */}
      <g transform="rotate(-7 200 170)">
        <rect
          x="95"
          y="50"
          width="215"
          height="150"
          rx="8"
          fill="#fff"
          stroke="#1e3a8a"
          strokeWidth="8"
        />
        <text
          x="122"
          y="92"
          fontSize="30"
          fontWeight="800"
          fontStyle="italic"
          fill="#1d4ed8"
          fontFamily="Inter, system-ui, sans-serif"
        >
          TAX
        </text>
        {[118, 148, 178].map((y) => (
          <g key={y}>
            <path
              d={`M124 ${y} l8 8 l14 -16`}
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="158" y={y - 5} width="110" height="6" rx="3" fill="#bfdbfe" />
          </g>
        ))}
        <path d="M60 212 H345 L362 236 H44 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="3" />
      </g>

      {/* calculator */}
      <g transform="rotate(-10 345 245)">
        <rect x="300" y="175" width="100" height="135" rx="12" fill="#1d4ed8" />
        <rect x="312" y="187" width="76" height="28" rx="5" fill="#bfdbfe" />
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={314 + c * 19}
              y={228 + r * 20}
              width="14"
              height="13"
              rx="3"
              fill="#60a5fa"
            />
          ))
        )}
      </g>

      {/* coin stacks */}
      {[
        { x: 440, n: 5 },
        { x: 408, n: 3 },
      ].map((s) =>
        Array.from({ length: s.n }).map((_, i) => {
          const y = 308 - i * 13;
          return (
            <g key={`${s.x}-${i}`}>
              <rect x={s.x - 30} y={y - 12} width="60" height="13" fill="#f59e0b" />
              <ellipse cx={s.x} cy={y} rx="30" ry="9" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <ellipse cx={s.x} cy={y - 12} rx="30" ry="9" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
            </g>
          );
        })
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  // Already logged in? Skip the login page.
  const existing = getSession();
  if (existing) {
    return <Navigate to={homePaths[existing.role]} replace />;
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Temporary login: checks the mock user list. The role comes from the
    // matched user, so there is no need to choose a role on this page.
    const user = authenticate(email, password);

    if (!user) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // "Remember me" keeps the session after the browser is closed.
    saveSession(
      { email: user.email, name: user.name, role: user.role },
      remember
    );

    navigate(user.destination, {
      state: { role: user.role, email: user.email, label: user.name },
    });
  };

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden bg-linear-to-br from-white via-blue-50 to-blue-200 font-sans text-slate-800 lg:h-dvh lg:overflow-y-auto [scrollbar:none] [&::-webkit-scrollbar]:hidden">
      {/* background shapes */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-160 w-160 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-130 w-130 rounded-full bg-sky-200/50 blur-3xl" />
      <svg
        viewBox="0 0 800 160"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 hidden h-36 w-[62%] lg:block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1d4ed8" />
            <stop offset="1" stopColor="#60a5fa" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M0 70 C150 20 300 120 500 90 C640 70 740 110 800 160 H0 Z" fill="url(#wave)" />
      </svg>

      <div className="relative z-10 mx-auto grid min-h-dvh max-w-375 gap-8 px-6 py-6 sm:px-10 lg:h-full lg:min-h-150 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[minmax(0,1fr)] lg:gap-[clamp(1rem,3dvh,2rem)] lg:px-14 lg:py-[clamp(0.75rem,3dvh,2rem)]">
        {/* ================= Left: brand + message ================= */}
        <section className="flex min-h-0 flex-col">
          <div className="flex items-center gap-3">
            <LogoMark className="h-14 w-14" />
            <div className="leading-tight">
              <p className="text-4xl font-extrabold tracking-tight text-[#14284b]">
                Tax<span className="text-sky-400">Mate</span>
              </p>
              <p className="text-sm font-medium text-slate-700">
                Tax Management System
              </p>
            </div>
          </div>

          <div className="mt-[clamp(0.75rem,4dvh,2.5rem)] hidden lg:block">
            <h1 className="text-[clamp(2rem,6.2dvh,3.75rem)] font-extrabold leading-[1.1] tracking-tight text-[#14284b]">
              Take Control.
              <br />
              Stay <span className="text-blue-600">Tax Confident.</span>
            </h1>
            <svg
              viewBox="0 0 300 12"
              className="mt-2 h-3 w-72 text-blue-600"
              aria-hidden="true"
            >
              <path
                d="M2 8 C80 2 200 2 298 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <p className="mt-[clamp(0.5rem,2dvh,1.25rem)] max-w-md text-[clamp(0.875rem,2.1dvh,1.125rem)] leading-relaxed text-slate-700">
              Manage your taxes, get expert advice, and stay compliant, all in
              one place.
            </p>

            <ul className="mt-[clamp(0.75rem,2.5dvh,1.75rem)] flex flex-wrap gap-4">
              {features.map((f) => (
                <li
                  key={f.label}
                  className="flex w-36 flex-col items-center gap-2 rounded-2xl border border-blue-100 bg-white/60 px-3 py-[clamp(0.5rem,1.8dvh,1rem)] text-center text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
                >
                  <span className="text-blue-600">
                    <Icon className="h-[clamp(1.5rem,3.6dvh,2rem)] w-[clamp(1.5rem,3.6dvh,2rem)]">{f.icon}</Icon>
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto hidden min-h-0 flex-1 pt-4 lg:block">
            <div className="mx-auto h-full w-full max-w-160">
              <Illustration />
            </div>
          </div>
        </section>

        {/* ================= Right: login card ================= */}
        <section className="flex min-h-0 flex-col">
          <div className="hidden items-center justify-end gap-3 text-sm font-medium text-blue-800 md:flex">
            <span className="text-blue-600">
              <Icon className="h-7 w-7">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                <path d="M8.5 12l2.5 2.5L16 9.5" />
              </Icon>
            </span>
            Secure &bull; Trusted &bull; For a Better Tomorrow
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center py-[clamp(0.5rem,2dvh,1.5rem)]">
            <div className="w-full max-w-130 rounded-3xl bg-white p-[clamp(1.25rem,3.6dvh,2.5rem)] shadow-2xl shadow-blue-900/10">
              <div className="flex flex-col items-center text-center">
                <LogoMark className="h-[clamp(2.5rem,5.5dvh,3.5rem)] w-[clamp(2.5rem,5.5dvh,3.5rem)]" />
                <h2 className="mt-2 text-[clamp(1.5rem,3.6dvh,1.875rem)] font-extrabold tracking-tight text-[#14284b]">
                  Welcome Back!
                </h2>
                <p className="mt-1 text-base text-slate-700">
                  Sign in to continue to your account
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="mt-[clamp(0.75rem,2.6dvh,1.75rem)] space-y-[clamp(0.6rem,1.8dvh,1rem)]">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 rounded-full border border-blue-100 bg-white px-5 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="text-blue-900">
                      <Icon>
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M3 7l9 6 9-6" />
                      </Icon>
                    </span>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="min-w-0 flex-1 bg-transparent py-[clamp(0.55rem,1.7dvh,0.875rem)] text-base text-slate-800 placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="flex items-center gap-3 rounded-full border border-blue-100 bg-white px-5 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="text-blue-900">
                      <Icon>
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 018 0v4" />
                      </Icon>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="min-w-0 flex-1 bg-transparent py-[clamp(0.55rem,1.7dvh,0.875rem)] text-base text-slate-800 placeholder-slate-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="text-slate-600 hover:bg-blue-600"
                    >
                      {showPassword ? (
                        <Icon>
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </Icon>
                      ) : (
                        <Icon>
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9 7-.2 1.1-1 2.4-2.2 3.6" />
                          <path d="M6.2 6.2C3.8 7.7 2.3 10 2 12c.5 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" />
                        </Icon>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-3 text-slate-800">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-300"
                    />
                    Remember me
                  </label>
                  {/* Add a /forgot-password route when you build that page */}
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-700 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <p role="alert" className="text-center text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-blue-800 to-blue-500 py-[clamp(0.6rem,1.7dvh,0.875rem)] text-lg font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-900 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  <Icon>
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                    <path d="M10 17l5-5-5-5M15 12H3" />
                  </Icon>
                  Login
                </button>
              </form>

              {/* Add a /register route when you build that page */}
              <p className="mt-[clamp(0.75rem,2.4dvh,1.5rem)] text-center text-base text-slate-800">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
                >
                  Create Account
                  <Icon className="h-4 w-4">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </Icon>
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}