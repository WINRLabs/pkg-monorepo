import type { SVGProps } from "react";
import * as React from "react";

const SvgIconCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={2}
      d="m3 15 6.294 5L21 4"
    />
  </svg>
);

export default SvgIconCheck;
