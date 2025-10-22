import { forwardRef } from "react";
import type { SVGProps } from "react";

export type IconBaseProps = SVGProps<SVGSVGElement>;

export const IconBase = forwardRef<SVGSVGElement, IconBaseProps>(
  (
    {
      className,
      role = "img",
      focusable = "false",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const ariaHidden = ariaLabel || ariaLabelledby ? undefined : true;

    return (
      <svg
        ref={ref}
        role={role}
        focusable={focusable}
        aria-hidden={ariaHidden}
        className={className}
        {...props}
      />
    );
  },
);

IconBase.displayName = "IconBase";

export function mergeClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
