import type { SVGProps } from "react";
import * as React from "react";

const SvgSend = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M2.812 2.683a.833.833 0 0 1 .894-.095l13.333 6.667a.833.833 0 0 1 0 1.49L3.706 17.412a.833.833 0 0 1-1.181-.947l1.408-5.632H7.5a.833.833 0 1 0 0-1.666H3.933L2.525 3.535a.833.833 0 0 1 .287-.852Z"
    />
  </svg>
);

export default SvgSend;
