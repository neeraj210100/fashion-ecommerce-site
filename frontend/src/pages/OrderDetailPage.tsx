import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatMoney } from "../api";
import type { Order } from "../types";
import { Spinner } from "../components/Spinner";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const o = await api.order(Number(id));
        if (alive) setOrder(o);
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Order not found");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const handleCancel = useCallback(async () => {
    if (!order || !window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const updated = await api.cancelOrder(order.id);
      setOrder(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  }, [order]);

  if (!id) return <p className="p-8 text-sm">Invalid order.</p>;
  if (loading) return <Spinner />;
  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-wine">{error ?? "Not found"}</p>
        <Link to="/orders" className="mt-4 inline-block text-sm underline">
          All orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/40">
        <Link to="/orders" className="hover:text-ink">
          Orders
        </Link>
        <span className="mx-2">/</span>
        <span>{order.orderNumber}</span>
      </div>

      <h1 className="font-display text-4xl font-medium">{order.orderNumber}</h1>
      <p className="mt-2 text-sm text-ink/50">
        Placed {new Date(order.createdAt).toLocaleString()} · Status{" "}
        <span className="text-ink">{order.status}</span>
      </p>

      {order.status === "PENDING" && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="mt-4 rounded-sm border border-wine/30 px-4 py-2 text-sm font-medium text-wine transition hover:bg-wine hover:text-white disabled:opacity-50"
        >
          {cancelling ? "Cancelling…" : "Cancel Order"}
        </button>
      )}

      <div className="mt-10 space-y-3 rounded-sm border border-ink/10 bg-white/60 p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/40">
          Ship to
        </p>
        <p className="text-sm leading-relaxed">
          {order.shippingName}
          <br />
          {order.shippingLine1}
          {order.shippingLine2 ? (
            <>
              <br />
              {order.shippingLine2}
            </>
          ) : null}
          <br />
          {order.shippingCity}, {order.shippingPostalCode}
          <br />
          {order.shippingCountry}
        </p>
      </div>

      <h2 className="mt-12 font-display text-2xl">Items</h2>
      <ul className="mt-4 divide-y divide-ink/10">
        {order.lines.map((line, i) => (
          <li
            key={`${line.productName}-${i}`}
            className="flex justify-between gap-4 py-4 text-sm"
          >
            <span>
              {line.productName}{" "}
              <span className="text-ink/45">× {line.quantity}</span>
            </span>
            <span>{formatMoney(line.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-right text-lg font-medium">
        {formatMoney(order.totalAmount)}
      </p>

      <Link to="/shop" className="mt-10 inline-block text-sm underline">
        Continue shopping
      </Link>
    </div>
  );
}
