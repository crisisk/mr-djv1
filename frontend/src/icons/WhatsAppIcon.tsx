import WhatsAppSvg from "./svgs/whatsapp.svg?react";
import type { IconProps } from "./types";
import { mergeClassNames } from "./types";

const defaultClassName = "h-8 w-8 text-neutral-light";

export const WhatsAppIcon = ({
  className,
  role = "img",
  "aria-label": ariaLabel,
  ...props
}: IconProps) => (
  <WhatsAppSvg
    className={mergeClassNames(defaultClassName, className)}
    role={role}
    aria-label={ariaLabel}
    {...props}
  />
);

export default WhatsAppIcon;
