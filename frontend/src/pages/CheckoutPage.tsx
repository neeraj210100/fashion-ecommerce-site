import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, formatMoney } from "../api";
import { Button } from "../components/Button";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState<number | null>(null);

  const [shippingName, setShippingName] = useState("");
  const [shippingLine1, setShippingLine1] = useState("");
  const [shippingLine2, setShippingLine2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const c = await api.cart();
        setSubtotal(c.subtotal);
      } catch {
        /* optional */
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const order = await api.checkout({
        shippingName,
        shippingLine1,
        shippingLine2: shippingLine2 || undefined,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
      });
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-4xl font-medium">Checkout</h1>
      <p className="mt-2 text-sm text-ink/50">
        This flow captures shipping details and places a pending order (payment
        integration can plug in next).
      </p>

      {subtotal != null ? (
        <p className="mt-6 text-sm">
          <span className="text-ink/50">Cart subtotal </span>
          <span className="font-medium">{formatMoney(subtotal)}</span>
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/40">
            Full name
          </label>
          <input
            required
            value={shippingName}
            onChange={(e) => setShippingName(e.target.value)}
            className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink/15"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/40">
            Address line 1
          </label>
          <input
            required
            value={shippingLine1}
            onChange={(e) => setShippingLine1(e.target.value)}
            className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink/15"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/40">
            Address line 2 (optional)
          </label>
          <input
            value={shippingLine2}
            onChange={(e) => setShippingLine2(e.target.value)}
            className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink/15"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/40">
              City
            </label>
            <input
              required
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
              className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink/15"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/40">
              Postal code
            </label>
            <input
              required
              value={shippingPostalCode}
              onChange={(e) => setShippingPostalCode(e.target.value)}
              className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink/15"
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/40">
            Country
          </label>
          <input
            required
            value={shippingCountry}
            onChange={(e) => setShippingCountry(e.target.value)}
            className="mt-2 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink/15"
          />
        </div>

        {error ? (
          <p className="text-sm text-wine" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            to="/cart"
            className="inline-flex items-center justify-center rounded-sm border border-ink/20 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-ink hover:border-ink/50"
          >
            Back to cart
          </Link>
          <Button type="submit" disabled={pending}>
            {pending ? "Placing order…" : "Place order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
