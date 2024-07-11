import type { SVGProps } from "react";
import * as React from "react";

const SvgCoinbaseLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#0052FF"
      d="M10 1.667a8.333 8.333 0 1 1 0 16.666 8.333 8.333 0 0 1 0-16.666Z"
    />
    <path
      fill="#fff"
      d="M10.004 12.928a2.928 2.928 0 1 1 2.885-3.416h2.95a5.86 5.86 0 1 0 0 .976h-2.954a2.923 2.923 0 0 1-2.881 2.44Z"
    />
  </svg>
);

export default SvgCoinbaseLogo;
