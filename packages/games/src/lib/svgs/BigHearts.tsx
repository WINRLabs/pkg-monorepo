import type { SVGProps } from "react";
import * as React from "react";

const SvgBigHearts = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={35}
    fill="none"
    {...props}
  >
    <path
      fill="#D9113A"
      fillRule="evenodd"
      d="M2.971 2.988c-3.873 3.873-3.873 10.151 0 14.024l3.005 3.005 14.025 14.025 14.024-14.025 3.005-3.005c3.873-3.873 3.873-10.151 0-14.024-3.873-3.873-10.152-3.873-14.024 0L20 5.993l-3.006-3.005c-3.872-3.873-10.151-3.873-14.024 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgBigHearts;
