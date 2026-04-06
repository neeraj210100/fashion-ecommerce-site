import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatMoney } from "../api";
import type { Order } from "../types";
import { Spinner } from "../components/Spinner";

function statusLabel(s: Order["status"]): string {
  switch (s) {
    case "PENDING":
      return "Pending";
    case "PAID":
      return "Paid";
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return s;
  }
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await api.orders();
        if (alive) setOrders(list);
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Could not load orders");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-wine">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-4xl font-medium">Orders</h1>
      <p className="mt-2 text-sm text-ink/50">
        Track confirmations and shipping for recent purchases.
      </p>

      {orders.length === 0 ? (
        <div className="mt-14 rounded-sm border border-dashed border-ink/15 bg-white/50 py-16 text-center">
          <p className="text-ink/55">No orders yet.</p>
          <Link to="/shop" className="mt-4 inline-block text-sm underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-ink/10">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-6">
              <div>
                <Link
                  to={`/orders/${o.id}`}
                  className="font-display text-xl hover:text-wine"
                >
                  {o.orderNumber}
                </Link>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-ink/40">
                  {new Date(o.createdAt).toLocaleString()} ·{" "}
                  {statusLabel(o.status)}
                </p>
              </div>
              <p className="text-sm font-medium">{formatMoney(o.totalAmount)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
