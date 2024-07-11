import type { SVGProps } from "react";
import * as React from "react";

const SvgBaccaratIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#baccarat-icon_svg__a)">
      <path d="M1.667 4.756A4.167 4.167 0 0 1 5.833.589h5c1.58 0 2.954.878 3.66 2.173a4.148 4.148 0 0 0-1.993-.506h-5a4.167 4.167 0 0 0-4.167 4.166v8.334c0 .722.184 1.4.507 1.993a4.166 4.166 0 0 1-2.173-3.66V4.756ZM13.087 10.906c0-.769-.607-1.375-1.376-1.375-.77 0-1.387.606-1.387 1.375 0 .77.618 1.387 1.387 1.387.77 0 1.376-.617 1.376-1.387Z" />
      <path
        fillRule="evenodd"
        d="M9.167 3.922A4.167 4.167 0 0 0 5 8.09v8.333a4.167 4.167 0 0 0 4.167 4.167h5a4.167 4.167 0 0 0 4.166-4.167V8.09a4.167 4.167 0 0 0-4.166-4.167h-5Zm2.446 9.768-1.451 2.395h1.625l2.307-3.727c.26-.423.401-.932.401-1.452a2.783 2.783 0 1 0-5.568 0 2.785 2.785 0 0 0 2.686 2.784Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="baccarat-icon_svg__a">
        <path fill="#fff" d="M0 .589h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgBaccaratIcon;
