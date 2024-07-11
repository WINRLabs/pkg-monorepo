import type { SVGProps } from "react";
import * as React from "react";

const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="#71717A"
      fillRule="evenodd"
      d="M3.578 3.578a.833.833 0 0 1 1.178 0L10 8.822l5.244-5.244a.833.833 0 0 1 1.179 1.179L11.179 10l5.244 5.244a.833.833 0 0 1-1.179 1.178L10 11.18l-5.244 5.244a.833.833 0 1 1-1.178-1.178L8.822 10 3.578 4.757a.833.833 0 0 1 0-1.179Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgClose;
