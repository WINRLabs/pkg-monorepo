import type { SVGProps } from 'react';
import * as React from 'react';

const SvgIconClose = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M17.414 16 24 9.414 22.586 8 16 14.586 9.414 8 8 9.414 14.586 16 8 22.586 9.414 24 16 17.414 22.586 24 24 22.586 17.414 16Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconClose;
