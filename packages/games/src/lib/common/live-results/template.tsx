import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Draggable from 'react-draggable';

import { Close, IconStats } from '../../svgs';
import { Button } from '../../ui/button';
import { Card, CardHeader } from '../../ui/card';
import { cn } from '../../utils/style';
import Result from './result';

const LiveResultsTemplate = () => {
  const [isHidden, setIsHidden] = useState(true);
  const dragRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isHidden ? (
        <motion.div
          className={cn('wr-fixed wr-bottom-[75px] wr-z-50 wr-w-[133px] lg:wr-bottom-[10px]')}
          initial={{
            opacity: 0,
            width: '300px',
            right: '10px',
          }}
          animate={{
            opacity: 1,
            width: '133px',
            right: '10px',
          }}
          exit={{
            opacity: 0,
            width: '300px',
            right: '10px',
          }}
          transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: 0 }}
        >
          <Button
            size={'lg'}
            className="wr-items-center wr-gap-1 wr-rounded-[1000px]"
            type="button"
            onClick={() => setIsHidden(false)}
          >
            <motion.div layoutId="svg-live-stats">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.0001 18.3337C14.6025 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6025 1.66699 10.0001 1.66699C5.39771 1.66699 1.66675 5.39795 1.66675 10.0003C1.66675 14.6027 5.39771 18.3337 10.0001 18.3337ZM10.0001 13.3337C11.841 13.3337 13.3334 11.8413 13.3334 10.0003C13.3334 8.15938 11.841 6.66699 10.0001 6.66699C8.15913 6.66699 6.66675 8.15938 6.66675 10.0003C6.66675 11.8413 8.15913 13.3337 10.0001 13.3337Z"
                  fill="white"
                />
              </svg>
            </motion.div>
            <motion.span layoutId="title">Live Stats</motion.span>
          </Button>
        </motion.div>
      ) : (
        <Draggable nodeRef={dragRef} bounds={'body'} handle=".handle">
          <motion.div
            initial={{
              opacity: 0,
              width: '133px',
              right: '10px',
            }}
            animate={{
              opacity: 1,
              width: '300px',
              right: '10px',
            }}
            exit={{
              opacity: 0,
              width: '133px',
              right: '10px',
            }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className={cn('wr-fixed wr-bottom-[10px] wr-z-50 wr-right-[10px]')}
            ref={dragRef}
          >
            <Card className="wr-live-stats  wr-overflow-hidden wr-rounded-md wr-border wr-border-zinc-800 wr-bg-zinc-950 wr-transition-all wr-duration-300 wr-ease-in">
              <CardHeader className="wr-flex wr-flex-row wr-items-center wr-justify-between wr-space-y-0 wr-text-xl wr-font-bold">
                <motion.div layoutId="svg-live-stats" className="handle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    className="wr-h-4 wr-w-4 wr-text-zinc-500"
                  >
                    <path
                      fill="currentColor"
                      d="m7.333 3.276-.862.862a.667.667 0 1 1-.943-.943l1.293-1.293c.651-.65 1.706-.65 2.357 0l1.293 1.293a.667.667 0 0 1-.943.943l-.861-.862v4.057h4.057l-.862-.862a.667.667 0 1 1 .943-.943l1.293 1.293c.65.651.65 1.706 0 2.357l-1.293 1.293a.667.667 0 0 1-.943-.943l.862-.861H8.667v4.057l.861-.862a.667.667 0 1 1 .943.943l-1.293 1.293c-.65.65-1.706.65-2.357 0l-1.293-1.293a.667.667 0 1 1 .943-.943l.862.862V8.667H3.276l.862.861a.667.667 0 0 1-.943.943L1.902 9.178a1.667 1.667 0 0 1 0-2.357l1.293-1.293a.667.667 0 1 1 .943.943l-.862.862h4.057V3.276Z"
                    />
                  </svg>
                </motion.div>

                <motion.span
                  className="mt-0 wr-flex wr-gap-2 wr-items-center wr-text-md wr-font-semibold"
                  layoutId="title"
                >
                  <IconStats className="h-5 w-5" />
                  Live Stats
                </motion.span>
                <motion.div className="div">
                  <Close className="wr-cursor-pointer" onClick={() => setIsHidden(true)} />
                </motion.div>
              </CardHeader>
              <Result />
            </Card>
          </motion.div>
        </Draggable>
      )}
    </AnimatePresence>
  );
};

export default LiveResultsTemplate;
