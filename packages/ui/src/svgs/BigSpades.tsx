import type { SVGProps } from "react";
import * as React from "react";

const SvgBigSpades = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={41}
    height={42}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M9.558 41.472a19.443 19.443 0 0 0 10.954-10.954 19.444 19.444 0 0 0 10.955 10.954H9.558Zm-6.226-24.07c-3.882 3.882-3.882 10.176 0 14.058 3.882 3.882 10.176 3.882 14.058 0l3.012-3.012 3.013 3.012c3.882 3.882 10.176 3.882 14.058 0 3.882-3.882 3.882-10.176 0-14.058L34.46 14.39 20.402.332 6.344 14.39l-3.012 3.012Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgBigSpades;
