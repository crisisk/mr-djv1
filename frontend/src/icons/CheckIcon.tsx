import CheckSvg from './svgs/check.svg?react';
import type { IconProps } from './types';
import { mergeClassNames } from './types';

const defaultClassName = 'h-5 w-5 text-primary';

export const CheckIcon = ({
  className,
  role = 'img',
  'aria-label': ariaLabel,
  ...props
}: IconProps) => (
  <CheckSvg
    className={mergeClassNames(defaultClassName, className)}
    role={role}
    aria-label={ariaLabel}
    {...props}
  />
);

export default CheckIcon;
