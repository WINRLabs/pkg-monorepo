import type { SVGProps } from "react";
import * as React from "react";

const SvgReferral = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={21}
    fill="none"
    {...props}
  >
    <g fill="#71717A">
      <path d="M10 2.254a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5ZM10 10.587c-2.798 0-5.031 1.472-6.206 3.657-.525.976-.327 1.988.254 2.711.07.087.146.17.227.25.563.55 1.367.882 2.221.882H12.5A2.5 2.5 0 0 1 10 15.61v-.043a2.5 2.5 0 0 1 2.5-2.479c0-.686.277-1.308.725-1.76a7.123 7.123 0 0 0-3.225-.74Z" />
      <path d="M15 12.254c.46 0 .833.373.833.833v1.667H17.5a.833.833 0 1 1 0 1.667h-1.667v1.666a.833.833 0 1 1-1.666 0v-1.666H12.5a.833.833 0 0 1 0-1.667h1.667v-1.667c0-.46.373-.833.833-.833Z" />
    </g>
  </svg>
);

export default SvgReferral;
