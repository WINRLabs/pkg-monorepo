import type { SVGProps } from 'react';
import * as React from 'react';

const SvgIconStars = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeWidth={2}
      d="M1 9c5.556 0 8-2.444 8-8 0 5.556 2.444 8 8 8-5.556 0-8 2.444-8 8 0-5.556-2.444-8-8-8ZM12 17.5c3.82 0 5.5-1.68 5.5-5.5 0 3.82 1.68 5.5 5.5 5.5-3.82 0-5.5 1.68-5.5 5.5 0-3.82-1.68-5.5-5.5-5.5Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconStars;
