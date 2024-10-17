import type { SVGProps } from 'react';
import * as React from 'react';

const SvgIconStrategy = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" className="icon-gift-box_svg__svg-icon" viewBox="0 0 64 64" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M23.34 16.13h29.17L46.63 22l4.24 4.24L64 13.13 50.87 0l-4.24 4.24 5.88 5.89H23.34c-7.732 0-14 6.268-14 14h6a8 8 0 0 1 8-8m17.32 31.74H11.49L17.37 42l-4.24-4.24L0 50.87 13.13 64l4.24-4.24-5.88-5.89h29.17c7.732 0 14-6.268 14-14h-6a8 8 0 0 1-8 8m-5.23-12.44V44h-6.86v-8.57H20v-6.86h8.57V20h6.86v8.57H44v6.86z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconStrategy;
