import React, { forwardRef } from 'react';

const IconBase = forwardRef(function IconBase(
  {
    className,
    role = 'img',
    focusable = 'false',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...props
  },
  ref,
) {
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
});

export function mergeClassNames(...values) {
  return values.filter(Boolean).join(' ');
}

export default IconBase;
