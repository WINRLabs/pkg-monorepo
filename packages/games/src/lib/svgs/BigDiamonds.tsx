import type { SVGProps } from "react";
import * as React from "react";

const SvgBigDiamonds = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <path
      fill="#D9113A"
      fillRule="evenodd"
      d="M21.992 42.909A30 30 0 0 0 5.091 26.008L0 24l5.091-2.008A30 30 0 0 0 21.992 5.091L24 0l2.008 5.091a30 30 0 0 0 16.901 16.901L48 24l-5.091 2.008a30 30 0 0 0-16.901 16.901L24 48l-2.008-5.091Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgBigDiamonds;
