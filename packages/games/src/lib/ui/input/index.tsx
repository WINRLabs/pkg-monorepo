import * as React from 'react';

import { cn } from '../../utils/style';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'ui-block ui-h-10 ui-border-none ui-bg-transparent ui-px-1 ui-text-base ui-font-semibold ui-leading-none focus:ui-border-zinc-100 focus:ui-outline-zinc-100',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  containerClassName?: string;
}

const InputWithIcons = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type, prefixIcon, suffixIcon, containerClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          'ui-flex ui-items-center ui-justify-between ui-rounded-md ui-bg-black focus-within:ui-shadow-[0_0_0px_3px_#F4F4F5]',
          containerClassName
        )}
      >
        {prefixIcon && <div className="ui-px-2">{prefixIcon}</div>}
        <input
          type={type}
          className={cn(
            'ui-block ui-h-10 ui-border-none ui-bg-transparent ui-px-3 ui-text-base ui-font-bold ui-leading-none focus:ui-border-none focus:ui-outline-none',
            className
          )}
          ref={ref}
          {...props}
        />
        {suffixIcon && <div className="ui-px-2">{suffixIcon}</div>}
      </div>
    );
  }
);

InputWithIcons.displayName = 'InputWithIcons';

export { Input, InputWithIcons };
