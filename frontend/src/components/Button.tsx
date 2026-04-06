import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-parchment hover:bg-wine transition-colors shadow-soft disabled:opacity-40",
  ghost: "text-ink hover:bg-sand/60",
  outline:
    "border border-ink/20 text-ink hover:border-ink/50 bg-transparent",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide uppercase ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
