import type { SVGProps } from "react";
import * as React from "react";

const SvgIconChevronUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M17.256 13.09a.833.833 0 0 1-1.179 0L10 7.011l-6.077 6.077a.833.833 0 0 1-1.179-1.178l6.077-6.078c.651-.65 1.707-.65 2.357 0l6.078 6.078a.833.833 0 0 1 0 1.178Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconChevronUp;
