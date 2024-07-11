import type { SVGProps } from "react";
import * as React from "react";

const SvgIconDownload = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.833 12.167c.46 0 .834.373.834.833v1.667c0 .92.746 1.666 1.666 1.666h8.334c.92 0 1.666-.746 1.666-1.666V13A.833.833 0 0 1 18 13v1.667A3.333 3.333 0 0 1 14.667 18H6.333A3.333 3.333 0 0 1 3 14.667V13c0-.46.373-.833.833-.833"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.5 13.417a.83.83 0 0 0 .59-.244l2.916-2.917a.833.833 0 1 0-1.179-1.179l-1.494 1.495V3.833a.833.833 0 0 0-1.666 0v6.739L8.173 9.077a.833.833 0 0 0-1.179 1.179l2.917 2.917a.83.83 0 0 0 .589.244"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconDownload;
