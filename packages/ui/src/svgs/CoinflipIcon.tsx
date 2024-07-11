import type { SVGProps } from "react";
import * as React from "react";

const SvgCoinflipIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <g clipPath="url(#coinflip-icon_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10 20.589c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Zm-2.342-8.504 1.52-3.259a.155.155 0 0 1 .05-.06.156.156 0 0 1 .086-.049 3.36 3.36 0 0 1 .646-.066h.08c.204 0 .42.022.646.066a.16.16 0 0 1 .087.05.155.155 0 0 1 .05.06l1.519 3.258.977-4.63a.156.156 0 0 1 .117-.12c.226-.053.563-.08 1.01-.08.385 0 .668.02.848.06a.155.155 0 0 1 .119.185l-1.366 6.105a.312.312 0 0 1-.25.238 4.877 4.877 0 0 1-2.222-.109.936.936 0 0 1-.615-.543L10 10.867l-.96 2.324a.937.937 0 0 1-.615.543 4.877 4.877 0 0 1-2.223.11.312.312 0 0 1-.25-.239L4.588 7.5a.155.155 0 0 1 .12-.185c.18-.04.462-.06.847-.06.447 0 .784.027 1.01.08.059.015.104.061.117.12l.977 4.63Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="coinflip-icon_svg__a">
        <path fill="#fff" d="M0 .589h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgCoinflipIcon;
