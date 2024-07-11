import type { SVGProps } from "react";
import * as React from "react";

const SvgEye = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8 2.667c2.536 0 5.005 1.404 6.712 4.076.489.765.489 1.749 0 2.514-1.707 2.672-4.176 4.076-6.712 4.076-2.536 0-5.004-1.404-6.711-4.075a2.338 2.338 0 0 1 0-2.515C2.996 4.07 5.464 2.667 8 2.667ZM5.667 8a2.333 2.333 0 1 1 4.667 0 2.333 2.333 0 0 1-4.667 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgEye;
