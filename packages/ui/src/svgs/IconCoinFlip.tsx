import type { SVGProps } from "react";
import * as React from "react";

const SvgIconCoinFlip = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g clipPath="url(#icon-coin-flip_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Zm-2.342-8.504 1.52-3.258a.155.155 0 0 1 .05-.06.156.156 0 0 1 .086-.05 3.36 3.36 0 0 1 .646-.066h.08a3.36 3.36 0 0 1 .675.075c.023.01.042.023.058.04a.155.155 0 0 1 .05.06l1.519 3.259.977-4.63a.156.156 0 0 1 .117-.119c.226-.054.563-.08 1.01-.08.385 0 .668.02.848.06a.155.155 0 0 1 .119.184l-1.366 6.105a.312.312 0 0 1-.25.238 4.868 4.868 0 0 1-2.222-.109.937.937 0 0 1-.615-.543L10 10.278l-.96 2.324a.937.937 0 0 1-.615.543 4.868 4.868 0 0 1-2.223.109.312.312 0 0 1-.25-.238L4.588 6.911a.155.155 0 0 1 .12-.185c.18-.04.462-.06.847-.06.447 0 .784.027 1.01.081.059.014.104.06.117.119l.977 4.63Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-coin-flip_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgIconCoinFlip;
