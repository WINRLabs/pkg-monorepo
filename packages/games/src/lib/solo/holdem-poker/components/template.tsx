'use client';

import React from 'react';

import { UnityAudioController } from '../../../common/audio-controller';
import { UnityGameContainer } from '../../../common/containers';
import { UnityFullscreenButton } from '../../../common/controller';
import useMediaQuery from '../../../hooks/use-media-query';
import { RotationWrapper } from '../../../ui/rotation-wrapper';
import { cn } from '../../../utils/style';
import { HoldemPokerGameProps } from '../types';
import { HoldemPokerScene } from './scene';

type TemplateProps = HoldemPokerGameProps & {
  minWager?: number;
  maxWager?: number;
  buildedGameUrl: string;
  onLogin?: () => void;
};

const HoldemPokerTemplate = (props: TemplateProps) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:1024px)');

  return (
    <RotationWrapper>
      <UnityGameContainer
        className={cn('wr-h-[640px] wr-relative max-lg:wr-h-full', {
          'wr-fixed -wr-left-0 wr-top-0 wr-z-50 wr-h-[100dvh] wr-w-[100dvw]':
            isFullscreen || isMobile,
        })}
      >
        <HoldemPokerScene {...props} />

        <UnityAudioController className="wr-absolute wr-left-2 wr-top-2 max-lg:wr-hidden" />
        <UnityFullscreenButton
          isFullscreen={isFullscreen}
          onChange={setIsFullscreen}
          className="wr-absolute wr-right-2 wr-top-2"
        />
      </UnityGameContainer>
    </RotationWrapper>
  );
};
export default HoldemPokerTemplate;
