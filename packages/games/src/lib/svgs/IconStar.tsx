import type { SVGProps } from 'react';
import * as React from 'react';

const SvgIconStar = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
      d="m12 2.5 2.792 5.657 6.243.907-4.518 4.404 1.067 6.218L12 16.75l-5.584 2.936 1.066-6.218-4.517-4.404 6.243-.907z"
    />
  </svg>
);

export default SvgIconStar;
