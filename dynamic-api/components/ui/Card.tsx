
import * as React from 'react';
import clsx from 'clsx';
export function Card({ className='', children }: React.PropsWithChildren<{className?: string}>) {
  return <div className={clsx('bg-white shadow-md rounded-2xl p-6', className)}>{children}</div>;
}
