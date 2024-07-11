import type { SVGProps } from "react";
import * as React from "react";

const SvgIconFullscreen = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 4H4v4m12-4h4v4m0 8v4h-4m-8 0H4v-4"
    />
  </svg>
);

export default SvgIconFullscreen;
