import type { SVGProps } from "react";
import * as React from "react";

const SvgChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#71717A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m8 10 2.94 2.94a1.5 1.5 0 0 0 2.12 0L16 10"
    />
  </svg>
);

export default SvgChevronDown;
