import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/Button";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from: string }).from.startsWith("/")
      ? (location.state as { from: string }).from
      : "/shop";

  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await api.login({ email, password });
      login(res);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
        Welcome back
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium">Sign in</h1>
      <p className="mt-2 text-sm text-ink/50">
        Use the demo account seeded by the API, or register a new email.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/40">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink/15"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/40">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink/15"
          />
        </div>
        {error ? (
          <p className="text-sm text-wine" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink/50">
        New here?{" "}
        <Link
          to="/register"
          state={location.state}
          className="font-medium text-ink underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
