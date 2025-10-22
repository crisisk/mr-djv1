
import * as React from 'react';
import clsx from 'clsx';
export default function Section({ className='', children, id }: React.PropsWithChildren<{className?: string; id?: string;}>) {
  return (
    <section id={id} className='py-16 md:py-24'>
      <div className={clsx('container-pro', className)}>{children}</div>
    </section>
  );
}
