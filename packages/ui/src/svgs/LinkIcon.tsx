import type { SVGProps } from "react";
import * as React from "react";

const SvgLinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={3}
      d="M10.55 14.2a4.375 4.375 0 0 0 6.187 0l4.42-4.42a4.375 4.375 0 0 0-6.188-6.187l-2.21 2.21"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={3}
      d="M14.085 10.664a4.375 4.375 0 0 0-6.187 0l-4.42 4.42a4.375 4.375 0 0 0 6.188 6.187l2.21-2.21"
    />
  </svg>
);

export default SvgLinkIcon;
