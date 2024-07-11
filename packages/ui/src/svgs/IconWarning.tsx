import type { SVGProps } from "react";
import * as React from "react";

const SvgIconWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={18}
    fill="none"
    {...props}
  >
    <path
      fill="#FACC15"
      fillRule="evenodd"
      d="M8.5.667a8.333 8.333 0 1 0 0 16.666A8.333 8.333 0 0 0 8.5.667Zm-1.667 7.5c0-.46.373-.834.834-.834H8.5c.46 0 .833.373.833.833v4.167a.833.833 0 0 1-1.666 0V9a.833.833 0 0 1-.834-.834ZM8.5 4.832a.833.833 0 1 0 0 1.667.833.833 0 0 0 0-1.667Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconWarning;
