export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  stock: number;
  featured: boolean;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AuthResponse = {
  token: string;
  email: string;
  fullName: string;
  userId: number;
};

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
  lineTotal: number;
};

export type Cart = {
  id: number;
  items: CartItem[];
  subtotal: number;
};

export type OrderLine = {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type Order = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  createdAt: string;
  lines: OrderLine[];
};
