import type {
  AuthResponse,
  Cart,
  Category,
  Order,
  PageResponse,
  Product,
} from "./types";

const JSON_HEADERS = { "Content-Type": "application/json" };

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string; message?: string };
    if (typeof body.error === "string") return body.error;
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return res.statusText || "Request failed";
}

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.json !== undefined) {
    headers.set("Content-Type", JSON_HEADERS["Content-Type"]!);
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(path, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  categories(): Promise<Category[]> {
    return request<Category[]>("/api/categories");
  },

  featuredProducts(page = 0, size = 8): Promise<PageResponse<Product>> {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    return request(`/api/products/featured?${q}`);
  },

  products(params: {
    category?: string;
    q?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Product>> {
    const q = new URLSearchParams();
    if (params.category) q.set("category", params.category);
    if (params.q) q.set("q", params.q);
    q.set("page", String(params.page ?? 0));
    q.set("size", String(params.size ?? 12));
    return request(`/api/products?${q}`);
  },

  productBySlug(slug: string): Promise<Product> {
    return request(`/api/products/${encodeURIComponent(slug)}`);
  },

  register(body: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AuthResponse> {
    return request("/api/auth/register", { method: "POST", json: body });
  },

  login(body: { email: string; password: string }): Promise<AuthResponse> {
    return request("/api/auth/login", { method: "POST", json: body });
  },

  cart(): Promise<Cart> {
    return request("/api/cart");
  },

  addToCart(productId: number, quantity: number): Promise<Cart> {
    return request("/api/cart/items", {
      method: "POST",
      json: { productId, quantity },
    });
  },

  updateCartItem(itemId: number, quantity: number): Promise<Cart> {
    return request(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      json: { quantity },
    });
  },

  checkout(body: {
    shippingName: string;
    shippingLine1: string;
    shippingLine2?: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
  }): Promise<Order> {
    return request("/api/orders/checkout", { method: "POST", json: body });
  },

  orders(): Promise<Order[]> {
    return request("/api/orders");
  },

  order(id: number): Promise<Order> {
    return request(`/api/orders/${id}`);
  },

  cancelOrder(id: number): Promise<Order> {
    return request(`/api/orders/${id}/cancel`, { method: "PATCH" });
  },
};

export function formatMoney(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
}
