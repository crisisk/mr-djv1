import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

const VARIANT_STYLES = {
  primary: "bg-primary text-neutral-light hover:bg-primary/90 focus-visible:ring-primary/40",
  secondary: "bg-secondary text-neutral-dark hover:bg-secondary/90 focus-visible:ring-secondary/40",
  outline:
    "border border-neutral-dark text-neutral-dark hover:bg-neutral-light focus-visible:ring-neutral-dark/40",
  ghost: "text-neutral-dark hover:bg-neutral-gray-100 focus-visible:ring-neutral-dark/30",
} as const;

const SIZE_STYLES = {
  sm: "px-spacing-sm py-spacing-xs body-sm",
  md: "px-spacing-md py-spacing-sm body-md",
  lg: "px-spacing-lg py-spacing-md body-lg",
} as const;

type Variant = keyof typeof VARIANT_STYLES;
type Size = keyof typeof SIZE_STYLES;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-md text-strong transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export const Button = forwardRef(function Button(
  { variant = "primary", size = "md", className = "", type = "button", ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const variantClasses = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const sizeClasses = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  return (
    <button
      ref={ref}
      type={type}
      className={[baseStyles, variantClasses, sizeClasses, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export default Button;
