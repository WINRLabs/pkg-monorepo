import type { SVGProps } from "react";
import * as React from "react";

const SvgIconSound = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M13 3.071V20.93L5.747 17H1V7h4.747L13 3.071ZM14.121 9.88c.544.543.879 1.292.879 2.12 0 .83-.335 1.578-.879 2.122l1.414 1.414A4.987 4.987 0 0 0 17 12c0-1.38-.56-2.631-1.465-3.535l-1.414 1.414Z"
    />
  </svg>
);

export default SvgIconSound;
