'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { useWeb3GamesModalsStore } from '../../common/modals/modals.store';
import { IconClose } from '../../svgs';
import { cn } from '../../utils/style';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props} />
);

DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    onClickOverlay?: () => void;
  }
>(({ className, onClickOverlay, ...props }, ref) => {
  const { closeModal } = useWeb3GamesModalsStore();

  const handleClickOverlay = (e: any) => {
    const target = e.target as HTMLElement;

    const parentContainer = target.closest('#modal-content');

    if (!parentContainer) {
      onClickOverlay?.();

      closeModal();
    }
  };

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      onClick={handleClickOverlay}
      className={cn(
        'wr-bg-background/80 wr-fixed wr-inset-0 wr-z-50 wr-backdrop-blur-sm data-[state=open]:wr-animate-in data-[state=closed]:wr-animate-out data-[state=closed]:wr-fade-out-0 data-[state=open]:wr-fade-in-0',
        className
      )}
      {...props}
    />
  );
});

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    onClickOverlay?: () => void;
  }
>(({ className, children, onClickOverlay, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay onClickOverlay={onClickOverlay} />
      <DialogPrimitive.Content
        ref={ref}
        onOpenAutoFocus={(event) => event.preventDefault()}
        id="modal-content"
        className={cn(
          'wr-fixed wr-left-[50%] wr-top-[50%] wr-max-h-[100dvh] wr-z-50 wr-grid wr-w-full wr-max-w-[420px] wr-translate-x-[-50%] wr-translate-y-[-50%] wr-bg-onyx-900 wr-p-0 wr-shadow-lg wr-duration-200 data-[state=open]:wr-animate-in data-[state=closed]:wr-animate-out data-[state=closed]:wr-fade-out-0 data-[state=open]:wr-fade-in-0 data-[state=closed]:wr-zoom-out-95 data-[state=open]:wr-zoom-in-95 data-[state=closed]:wr-slide-out-to-left-1/2 data-[state=closed]:wr-slide-out-to-top-[48%] data-[state=open]:wr-slide-in-from-left-1/2 data-[state=open]:wr-slide-in-from-top-[48%] max-md:wr-bottom-0 max-md:wr-top-[unset] max-md:wr-translate-y-[-14px] max-md:wr-overflow-y-scroll sm:wr-max-w-[420px] sm:wr-rounded-lg md:wr-w-full',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  closeModalCb,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { closeModalCb?: () => void }) => {
  const { closeModal } = useWeb3GamesModalsStore();

  return (
    <div
      className={cn('wr-flex wr-items-center wr-justify-between wr-p-4 sm:wr-text-left', className)}
      {...props}
    >
      {props.children}
      <DialogPrimitive.Close
        className="ring-offset-background data-[state=open]:bg-accent data-[state=open]:text-muted-foreground focus:ring-ring wr-bg-onyx-400 wr-bg-opacity-70 wr-rounded-sm wr-p-2 wr-opacity-70 wr-transition-opacity hover:wr-opacity-100 focus:wr-outline-none focus:wr-ring-2 focus:wr-ring-offset-2 disabled:wr-pointer-events-none"
        onClick={() => {
          closeModalCb?.();

          closeModal();
        }}
      >
        <IconClose className="wr-h-6 wr-w-6 wr-text-zinc-500" />
      </DialogPrimitive.Close>
    </div>
  );
};

DialogHeader.displayName = 'DialogHeader';

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('wr-p-4', className)} {...props}>
      {props.children}
    </div>
  );
};

DialogHeader.displayName = 'DialogBody';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('wr-p-4', className)} {...props} />
);

DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'wr-flex wr-items-center wr-gap-2 wr-text-lg wr-font-bold wr-leading-none wr-tracking-tight',
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground wr-text-base', className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
