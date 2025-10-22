import React, { forwardRef } from "react";

const mergeClasses = (...classNames) => classNames.filter(Boolean).join(" ");

const VARIANT_STYLES = {
  primary: "bg-primary text-neutral-light hover:bg-primary/90 focus-visible:ring-primary/40",
  secondary: "bg-secondary text-neutral-dark hover:bg-secondary/90 focus-visible:ring-secondary/40",
  outline:
    "border border-neutral-dark text-neutral-dark hover:bg-neutral-light focus-visible:ring-neutral-dark/40",
  ghost: "text-neutral-dark hover:bg-neutral-gray-100 focus-visible:ring-neutral-dark/30",
  gradient:
    "bg-gradient-to-r from-primary to-secondary text-neutral-light shadow-[0_15px_40px_rgba(17,24,39,0.25)] hover:from-primary/90 hover:to-secondary/90 focus-visible:ring-secondary/50",
  glass:
    "border border-white/35 bg-white/15 text-neutral-light backdrop-blur-xl hover:bg-white/25 focus-visible:ring-white/60 focus-visible:ring-offset-neutral-dark",
};

const SIZE_STYLES = {
  sm: "px-spacing-sm py-spacing-xs text-font-size-small",
  md: "px-spacing-md py-spacing-sm text-font-size-body",
  lg: "px-spacing-lg py-spacing-md text-font-size-h4",
};

const ICON_ONLY_SIZE_STYLES = {
  sm: "p-spacing-xs",
  md: "p-spacing-sm",
  lg: "p-spacing-md",
};

const baseStyles =
  "inline-flex items-center justify-center rounded-md font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const Spinner = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 animate-spin text-current"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      d="M4 12a8 8 0 018-8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="4"
    />
  </svg>
);

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      type = "button",
      leadingIcon,
      trailingIcon,
      isLoading = false,
      loadingText,
      fullWidth = false,
      iconSpacing = "gap-spacing-xs",
      children,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const variantClasses = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
    const sizeClasses = SIZE_STYLES[size] ?? SIZE_STYLES.md;
    const widthClass = fullWidth ? "w-full" : "";
    const iconOnly = !children && !loadingText && (leadingIcon || trailingIcon);
    const computedSizeClasses = iconOnly
      ? (ICON_ONLY_SIZE_STYLES[size] ?? ICON_ONLY_SIZE_STYLES.md)
      : sizeClasses;
    const contentClasses = mergeClasses(
      "inline-flex items-center justify-center",
      iconOnly ? "" : iconSpacing,
    );
    const buttonClasses = mergeClasses(
      baseStyles,
      variantClasses,
      computedSizeClasses,
      widthClass,
      className,
    );
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        aria-busy={isLoading}
        className={buttonClasses}
        disabled={isDisabled}
        type={type}
        {...props}
      >
        <span className={contentClasses}>
          {isLoading ? (
            <>
              <Spinner />
              <span className="ml-spacing-xs">{loadingText ?? children ?? ""}</span>
            </>
          ) : (
            <>
              {leadingIcon ? (
                <span aria-hidden="true" className="flex items-center">
                  {leadingIcon}
                </span>
              ) : null}
              {children ? <span>{children}</span> : null}
              {trailingIcon ? (
                <span aria-hidden="true" className="flex items-center">
                  {trailingIcon}
                </span>
              ) : null}
            </>
          )}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
