import type { SVGProps } from "react";
import * as React from "react";

const SvgArrowBottom = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="#71717A"
      fillRule="evenodd"
      d="M10.833 15.61c.124-.07.24-.16.346-.265l3.232-3.232a.833.833 0 0 1 1.178 1.178l-3.232 3.233a3.333 3.333 0 0 1-4.714 0L4.411 13.29a.833.833 0 0 1 1.178-1.178l3.233 3.232c.105.106.221.194.345.265V3.328a.833.833 0 1 1 1.666 0v12.284Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgArrowBottom;
