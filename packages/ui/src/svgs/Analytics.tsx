import type { SVGProps } from "react";
import * as React from "react";

const SvgAnalytics = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={21}
    fill="none"
    {...props}
  >
    <path
      fill="#71717A"
      fillRule="evenodd"
      d="M.833 3.921c0-.46.373-.833.834-.833h16.666a.833.833 0 0 1 0 1.667H17.5v7.5a3.333 3.333 0 0 1-3.333 3.333h-2.61l.803 1.204a.833.833 0 1 1-1.387.925L10 16.257l-.973 1.46a.833.833 0 0 1-1.387-.925l.803-1.204h-2.61A3.333 3.333 0 0 1 2.5 12.255v-7.5h-.833a.833.833 0 0 1-.834-.834Zm10 3.334a.833.833 0 0 0-1.666 0v4.166a.833.833 0 1 0 1.666 0V7.255Zm3.334 1.666a.833.833 0 0 0-1.667 0v2.5a.833.833 0 1 0 1.667 0v-2.5ZM7.5 10.588a.833.833 0 0 0-1.667 0v.833a.833.833 0 1 0 1.667 0v-.833Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgAnalytics;
