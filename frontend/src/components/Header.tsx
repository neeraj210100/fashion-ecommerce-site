import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-xs font-medium uppercase tracking-[0.2em] ${
    isActive ? "text-ink" : "text-ink/50 hover:text-ink"
  }`;

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-parchment/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-2xl font-medium tracking-tight">
          Atelier
        </Link>
        <nav className="flex items-center gap-6 md:gap-8">
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          {user ? (
            <NavLink to="/orders" className={linkClass}>
              Orders
            </NavLink>
          ) : null}
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <span className="hidden max-w-[140px] truncate text-xs text-ink/60 sm:inline">
              {user.fullName}
            </span>
          ) : null}
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="text-xs font-medium uppercase tracking-[0.15em] text-ink/45 hover:text-ink"
            >
              Sign out
            </button>
          ) : (
            <NavLink
              to="/login"
              className="text-xs font-medium uppercase tracking-[0.15em] text-ink/70 hover:text-ink"
            >
              Sign in
            </NavLink>
          )}
          <NavLink
            to="/cart"
            className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-ink hover:border-ink/40"
          >
            Cart
          </NavLink>
        </div>
      </div>
    </header>
  );
}
