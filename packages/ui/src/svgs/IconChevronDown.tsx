import type { SVGProps } from "react";
import * as React from "react";

const SvgIconChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M2.744 6.911a.833.833 0 0 1 1.179 0L10 12.99l6.077-6.078a.833.833 0 1 1 1.179 1.179l-6.078 6.077c-.65.65-1.706.65-2.357 0L2.745 8.09a.833.833 0 0 1 0-1.179Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconChevronDown;
