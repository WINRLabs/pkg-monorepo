import type { SVGProps } from "react";
import * as React from "react";

const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <g fill="currentColor">
      <path d="M10 1.667a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5ZM10 10c-2.798 0-5.031 1.472-6.206 3.658-.525.975-.327 1.987.254 2.71.561.698 1.472 1.132 2.448 1.132h7.008c.976 0 1.886-.434 2.448-1.132.58-.723.778-1.735.254-2.71C15.031 11.472 12.798 10 10 10Z" />
    </g>
  </svg>
);

export default SvgPerson;
