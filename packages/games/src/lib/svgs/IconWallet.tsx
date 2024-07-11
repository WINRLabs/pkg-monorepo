import type { SVGProps } from "react";
import * as React from "react";

const SvgIconWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M3.417.5A2.917 2.917 0 0 0 .5 3.417v8.75A3.333 3.333 0 0 0 3.833 15.5h10.834c.46 0 .833-.373.833-.833V5.5a.833.833 0 0 0-.833-.833h-2.5V1.333A.833.833 0 0 0 11.333.5H3.417ZM10.5 4.667v-2.5H3.417a1.25 1.25 0 1 0 0 2.5H10.5Zm.417 6.458a1.042 1.042 0 1 0 0-2.083 1.042 1.042 0 0 0 0 2.083Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconWallet;
