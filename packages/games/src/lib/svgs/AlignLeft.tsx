import type { SVGProps } from "react";
import * as React from "react";

const SvgAlignLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#71717A"
      fillRule="evenodd"
      d="M2.5 3.333c.46 0 .833.374.833.834v11.666a.833.833 0 0 1-1.667 0V4.168c0-.46.374-.833.834-.833ZM9.547 5.87a.833.833 0 0 1 0 1.179L7.428 9.167H17.5a.833.833 0 1 1 0 1.667H7.428l2.12 2.119a.833.833 0 1 1-1.18 1.178l-2.657-2.658a2.083 2.083 0 0 1 0-2.946L8.37 5.869a.833.833 0 0 1 1.178 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgAlignLeft;
