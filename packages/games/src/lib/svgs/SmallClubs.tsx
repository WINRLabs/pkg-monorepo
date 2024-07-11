import type { SVGProps } from "react";
import * as React from "react";

const SvgSmallClubs = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={13}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M5.5 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-3 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM11 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-1.964 5A6.276 6.276 0 0 1 5.5 8.964 6.276 6.276 0 0 1 1.965 12.5h7.07Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgSmallClubs;
