import type { SVGProps } from "react";
import * as React from "react";

const SvgMedalTrophy = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill ? props.fill : "#725B1E"}
      fillRule="evenodd"
      d="M4 9a8 8 0 1 1 13 6.245v5.386a2 2 0 0 1-2.894 1.789L12 21.367 9.894 22.42A2 2 0 0 1 7 20.63v-5.385A7.985 7.985 0 0 1 4 9Zm5 7.419v4.212l2.106-1.053a2 2 0 0 1 1.788 0L15 20.631v-4.212A7.978 7.978 0 0 1 12 17a7.978 7.978 0 0 1-3-.581Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgMedalTrophy;
