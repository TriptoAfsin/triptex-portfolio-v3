import React from 'react';

import { cn } from '@/lib/utils/cn';

export function Container(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, className, ...rest } = props;
  return (
    <div className={cn('w-full 2xl:container mx-auto', className)} {...rest}>
      {children}
    </div>
  );
}
