import React from 'react';

import { cn } from '@/lib/utils/cn';

export function Title(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const { children, className, ...rest } = props;
  return (
    <h2
      className={cn(
        'text-gray-700 dark:text-gray-200 font-medium text-xl',
        className
      )}
      {...rest}
    >
      {children}
    </h2>
  );
}
