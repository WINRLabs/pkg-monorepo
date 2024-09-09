'use client';

import { TOAST_REMOVE_DELAY, useToast } from '../../hooks/use-toast';
import { IconSmile } from '../../svgs';
import { cn } from '../../utils/style';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTimer,
  ToastTitle,
  ToastViewport,
} from '../toast';
import styles from './styles.module.css';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="block">
            <div className="flex items-center gap-3">
              {props.variant === 'success' && (
                <span className="flex items-center justify-center rounded-sm border border-zinc-800 p-3">
                  <IconSmile className="h-8 w-8 text-green-500" />
                </span>
              )}
              {props.variant === 'pending' && (
                <span className="flex items-center justify-center rounded-sm border border-zinc-800 p-3">
                  <IconSmile className="h-8 w-8 text-yellow-500" />
                </span>
              )}
              {props.variant === 'error' && (
                <span className="flex items-center justify-center rounded-sm border border-zinc-800 p-3">
                  <IconSmile className="h-8 w-8 text-red-500" />
                </span>
              )}
              <div>
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="flex items-center">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastTimer
              duration={props.duration || TOAST_REMOVE_DELAY}
              className={cn(styles.timer, 'mt-3')}
              thumbClassName={cn('h-[6px]', {
                'bg-green-500': props.variant === 'success',
                'bg-red-600': props.variant === 'error',
                'bg-yellow-500': props.variant === 'pending',
              })}
            />
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
