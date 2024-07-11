import type { SVGProps } from "react";
import * as React from "react";

const SvgRecord = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10 18.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666Zm0-5a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgRecord;
