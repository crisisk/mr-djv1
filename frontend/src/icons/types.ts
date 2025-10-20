import type { ComponentPropsWithoutRef } from 'react';

export type IconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'role'> & {
  role?: ComponentPropsWithoutRef<'svg'>['role'];
  'aria-label'?: string;
};

export const mergeClassNames = (
  defaultClassName: string,
  provided?: string,
): string => {
  if (!provided) {
    return defaultClassName;
  }

  return [defaultClassName, provided].filter(Boolean).join(' ');
};
