import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "홈" },
  { to: "/startup-location", label: "상권" },
  { to: "/finance", label: "금융" },
  { to: "/business-simulation", label: "매출" },
  { to: "/settings", label: "세팅" },
];

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,168,0,0.08),_transparent_30%),linear-gradient(135deg,_var(--color-kb-background-soft)_0%,_var(--color-kb-background)_100%)] text-kb-gray">
      <header className="border-b border-kb-surface-secondary bg-kb-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-kb-gray">
            Startup Guide
          </Link>
          <nav className="flex flex-wrap items-center gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-full bg-kb-yellow-positive px-3 py-2 text-sm font-medium text-white"
                    : "rounded-full px-3 py-2 text-sm text-kb-mid-tone transition hover:bg-kb-background hover:text-kb-gray"
                }>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
