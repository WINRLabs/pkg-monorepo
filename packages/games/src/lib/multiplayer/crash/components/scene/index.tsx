import { useState } from 'react';

import { useCrashGame } from './game';

export default function Scene() {
  const [sceneElementRef, setSceneElementRef] = useState<HTMLElement | null>(null);
  useCrashGame({ elementRef: sceneElementRef });

  return <div ref={(ref) => setSceneElementRef(ref)} className="wr-h-full"></div>;
}
