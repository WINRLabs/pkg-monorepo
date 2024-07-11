import type { SVGProps } from "react";
import * as React from "react";

const SvgMadal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.333 7.5a6.667 6.667 0 1 1 10.833 5.205v4.487a1.667 1.667 0 0 1-2.412 1.491L10 17.806l-1.755.877a1.667 1.667 0 0 1-2.412-1.49v-4.488a6.654 6.654 0 0 1-2.5-5.205ZM7.5 13.682v3.51l1.754-.877a1.667 1.667 0 0 1 1.491 0l1.755.877v-3.51a6.648 6.648 0 0 1-2.5.485 6.648 6.648 0 0 1-2.5-.485Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgMadal;
