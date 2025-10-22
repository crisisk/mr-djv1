import StarSvg from "./svgs/star.svg?react";
import type { IconProps } from "./types";
import { mergeClassNames } from "./types";

const defaultClassName = "h-5 w-5 text-secondary";

export const StarIcon = ({
  className,
  role = "img",
  "aria-label": ariaLabel,
  ...props
}: IconProps) => (
  <StarSvg
    className={mergeClassNames(defaultClassName, className)}
    role={role}
    aria-label={ariaLabel}
    {...props}
  />
);

export default StarIcon;
