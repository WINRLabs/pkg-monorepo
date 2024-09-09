'use client';

import { IconWarning } from '../../../svgs';
import { Button } from '../../../ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog';
import { useWeb3GamesModalsStore } from '../modals.store';
import { Web3GamesRefundModalProps } from '../types';

export const RefundModal = ({
  isRefundable,
  isRefunding,
  playerRefund,
}: Web3GamesRefundModalProps) => {
  const { modal, openModal } = useWeb3GamesModalsStore();

  return (
    <Dialog open={modal === 'refund'}>
      <DialogContent
        onPointerDownOutside={() =>
          setTimeout(
            () =>
              openModal('refund', {
                refund: {
                  isRefundable,
                  isRefunding,
                  playerRefund,
                },
              }),
            500
          )
        }
        onInteractOutside={() =>
          setTimeout(
            () =>
              openModal('refund', {
                refund: {
                  isRefundable,
                  isRefunding,
                  playerRefund,
                },
              }),
            500
          )
        }
        className="sm:wr-max-w-[540px]"
      >
        <DialogHeader isCloseButtonDisabled>
          <DialogTitle className="wr-flex wr-items-center wr-gap-2">
            <IconWarning />
            Refund
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="wr-pt-0 wr-font-medium">
          You have a refundable game. Please make a refund you can continue playing.
        </DialogBody>
        <DialogFooter className="wr-flex">
          <Button
            onClick={() => playerRefund && playerRefund()}
            isLoading={isRefunding}
            disabled={isRefunding}
            className="wr-mx-auto wr-w-full wr-text-sm"
            variant="success"
          >
            Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
