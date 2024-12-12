import { useState } from 'react';

import { useCrashGame } from './game';

export default function Scene() {
  const [sceneElementRef, setSceneElementRef] = useState<HTMLElement | null>(null);
  useCrashGame({ elementRef: sceneElementRef });

  // todo: what the heck is this?
  return <div ref={(ref) => setSceneElementRef(ref)}></div>;
}
