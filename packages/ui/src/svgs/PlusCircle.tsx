import type { SVGProps } from "react";
import * as React from "react";

const SvgPlusCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1.667 10.001a8.333 8.333 0 1 1 16.666 0 8.333 8.333 0 0 1-16.666 0Zm11.666.834a.833.833 0 1 0 0-1.667h-2.5v-2.5a.833.833 0 0 0-1.666 0v2.5h-2.5a.833.833 0 1 0 0 1.667h2.5v2.5a.833.833 0 1 0 1.666 0v-2.5h2.5Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgPlusCircle;
