import type { SVGProps } from "react";
import * as React from "react";

const SvgYoutubeLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M4 3.255a2.667 2.667 0 0 0-2.667 2.667v4a2.667 2.667 0 0 0 2.666 2.667h8a2.667 2.667 0 0 0 2.667-2.667v-4a2.667 2.667 0 0 0-2.667-2.667H4Zm3.142 2.667c.083 0 .155.023.223.063.039.022 2.414 1.488 2.5 1.578a.52.52 0 0 1 .075.594.517.517 0 0 1-.12.156c-.08.067-2.47 1.556-2.53 1.578a.429.429 0 0 1-.148.031.467.467 0 0 1-.312-.125.5.5 0 0 1-.164-.375v-3c0-.276.213-.5.476-.5Z"
    />
  </svg>
);

export default SvgYoutubeLogo;
