import type { SVGProps } from "react";
import * as React from "react";

const SvgIconMute = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M13 3.071V20.93L5.747 17H1V7h4.747L13 3.071ZM20.793 12.121l2.121-2.12L21.5 8.585l-2.121 2.121-2.122-2.121L15.843 10l2.121 2.121-2.12 2.122 1.413 1.414 2.122-2.121 2.121 2.121 1.414-1.414-2.121-2.122Z"
    />
  </svg>
);

export default SvgIconMute;
