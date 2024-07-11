import type { SVGProps } from "react";
import * as React from "react";

const SvgIconCrash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#icon-crash_svg__a)">
      <path d="M1.25 0C1.94 0 2.5.56 2.5 1.25v13.015a15.187 15.187 0 0 0 4.703-1.876 15.697 15.697 0 0 0 5.266-5.283c.445-.734 1.36-1.076 2.143-.722.807.364 1.161 1.324.714 2.088a19.146 19.146 0 0 1-6.563 6.677A18.499 18.499 0 0 1 2.72 17.5h16.03a1.25 1.25 0 1 1 0 2.5H1.667C.747 20 0 19.254 0 18.333V1.25C0 .56.56 0 1.25 0ZM19.167 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
    </g>
    <defs>
      <clipPath id="icon-crash_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgIconCrash;
