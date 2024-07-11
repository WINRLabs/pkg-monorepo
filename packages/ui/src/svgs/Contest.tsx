import type { SVGProps } from "react";
import * as React from "react";

const SvgContest = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={21}
    fill="none"
    {...props}
  >
    <path
      fill="#71717A"
      fillRule="evenodd"
      d="M3.333 8.089a6.667 6.667 0 1 1 10.834 5.204v4.488a1.667 1.667 0 0 1-2.412 1.49L10 18.395l-1.755.878a1.667 1.667 0 0 1-2.412-1.491v-4.488a6.654 6.654 0 0 1-2.5-5.204ZM7.5 14.27v3.51l1.755-.877a1.666 1.666 0 0 1 1.49 0l1.755.877v-3.51a6.648 6.648 0 0 1-2.5.484 6.648 6.648 0 0 1-2.5-.484Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgContest;
