import type { SVGProps } from "react";
import * as React from "react";

const SvgCrashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#crash-icon_svg__a)">
      <path d="M1.25.589c.69 0 1.25.56 1.25 1.25v13.015a15.187 15.187 0 0 0 4.703-1.876 15.697 15.697 0 0 0 5.266-5.283c.445-.735 1.36-1.076 2.143-.722.807.364 1.161 1.324.714 2.088a19.145 19.145 0 0 1-6.563 6.676A18.501 18.501 0 0 1 2.72 18.09h16.03a1.25 1.25 0 1 1 0 2.5H1.667c-.92 0-1.667-.746-1.667-1.667V1.84c0-.69.56-1.25 1.25-1.25ZM19.167 3.089a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
    </g>
    <defs>
      <clipPath id="crash-icon_svg__a">
        <path fill="#fff" d="M0 .589h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgCrashIcon;
