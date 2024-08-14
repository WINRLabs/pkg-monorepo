'use client';

import React from 'react';

import { cn } from '../utils/style';

export const LastBetsContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  dir?: 'horizontal' | 'vertical';
}> = ({ children, className, dir = 'horizontal' }) => {
  return (
    <div
      className={cn(
        'wr-absolute wr-top-5 wr-left-1/2 -wr-translate-x-1/2 wr-flex wr-max-w-[350px] wr-items-center wr-justify-center wr-gap-[6px] wr-overflow-hidden',
        {
          'wr-max-h-[calc(100%-40px)]': dir === 'vertical',
        },
        className
      )}
    >
      {children}
    </div>
  );
};
