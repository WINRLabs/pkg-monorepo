import type { SVGProps } from "react";
import * as React from "react";

const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.417 2.5A2.917 2.917 0 0 0 2.5 5.417v8.75A3.333 3.333 0 0 0 5.833 17.5h10.834c.46 0 .833-.373.833-.833V7.5a.833.833 0 0 0-.833-.833h-2.5V3.333a.833.833 0 0 0-.834-.833H5.417ZM12.5 6.667v-2.5H5.417a1.25 1.25 0 1 0 0 2.5H12.5Zm.417 6.458a1.042 1.042 0 1 0 0-2.083 1.042 1.042 0 0 0 0 2.083Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgWallet;
