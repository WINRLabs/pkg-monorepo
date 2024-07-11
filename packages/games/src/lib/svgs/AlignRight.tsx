import type { SVGProps } from "react";
import * as React from "react";

const SvgAlignRight = (props: SVGProps<SVGSVGElement>) => (
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
      d="M17.5 16.666a.833.833 0 0 1-.833-.833V4.167a.833.833 0 0 1 1.666 0v11.666c0 .46-.373.833-.833.833Zm-7.047-2.535a.833.833 0 0 1 0-1.179l2.119-2.119H2.5a.833.833 0 0 1 0-1.666h10.072l-2.12-2.12a.833.833 0 1 1 1.18-1.178l2.657 2.658a2.083 2.083 0 0 1 0 2.946l-2.658 2.658a.833.833 0 0 1-1.178 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgAlignRight;
