import type { SVGProps } from "react";
import * as React from "react";

const SvgIconCreditCard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M2.167 5.833a2.5 2.5 0 0 1 2.5-2.5h11.666a2.5 2.5 0 0 1 2.5 2.5V7.5H2.167zM2.167 9.166v5a2.5 2.5 0 0 0 2.5 2.5h11.666a2.5 2.5 0 0 0 2.5-2.5v-5z"
    />
  </svg>
);

export default SvgIconCreditCard;
