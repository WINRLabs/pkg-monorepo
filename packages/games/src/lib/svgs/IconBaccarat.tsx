import type { SVGProps } from "react";
import * as React from "react";

const SvgIconBaccarat = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M0 4.167A4.167 4.167 0 0 1 4.167 0h5c1.579 0 2.953.878 3.66 2.173a4.148 4.148 0 0 0-1.994-.506h-5a4.167 4.167 0 0 0-4.166 4.166v8.334c0 .722.183 1.4.506 1.993A4.166 4.166 0 0 1 0 12.5V4.167ZM11.42 10.318c0-.77-.607-1.376-1.376-1.376-.769 0-1.386.606-1.386 1.376 0 .769.617 1.386 1.386 1.386.77 0 1.376-.617 1.376-1.386Z"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7.5 3.333A4.167 4.167 0 0 0 3.333 7.5v8.333A4.167 4.167 0 0 0 7.5 20h5a4.167 4.167 0 0 0 4.167-4.167V7.5A4.167 4.167 0 0 0 12.5 3.333h-5Zm2.447 9.769-1.452 2.394h1.625l2.308-3.727c.26-.422.4-.931.4-1.451a2.783 2.783 0 1 0-5.568 0 2.785 2.785 0 0 0 2.687 2.784Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconBaccarat;
