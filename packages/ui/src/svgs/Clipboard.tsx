import type { SVGProps } from "react";
import * as React from "react";

const SvgClipboard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.887 3.335h.446a3.333 3.333 0 0 1 3.334 3.333v8.333a3.333 3.333 0 0 1-3.334 3.334H6.667A3.333 3.333 0 0 1 3.333 15V6.668a3.333 3.333 0 0 1 3.334-3.333h.446a3.332 3.332 0 0 1 5.774 0ZM8.333 5h3.334a1.667 1.667 0 0 0-3.334 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgClipboard;
