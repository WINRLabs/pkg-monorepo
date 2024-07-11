import type { SVGProps } from "react";
import * as React from "react";

const SvgIconDice = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g clipPath="url(#icon-dice_svg__a)">
      <path
        fill="currentColor"
        d="M15.833 7.5h-4.166A4.172 4.172 0 0 0 7.5 11.667v4.166A4.172 4.172 0 0 0 11.667 20h4.166A4.171 4.171 0 0 0 20 15.833v-4.166A4.172 4.172 0 0 0 15.833 7.5Zm-4.166 5a.834.834 0 1 1 0-1.667.834.834 0 0 1 0 1.667Zm4.166 4.167a.833.833 0 1 1 0-1.667.833.833 0 0 1 0 1.667ZM13 4.167l-2.943-2.949a4.172 4.172 0 0 0-5.89 0L1.218 4.167a4.172 4.172 0 0 0 0 5.892L4.167 13a4.134 4.134 0 0 0 1.666 1.02v-2.353a5.84 5.84 0 0 1 5.834-5.834h2.356A4.135 4.135 0 0 0 13 4.167ZM4.167 8.333a.833.833 0 1 1 0-1.666.833.833 0 0 1 0 1.666ZM7.5 5a.833.833 0 1 1 0-1.667A.833.833 0 0 1 7.5 5Z"
      />
    </g>
    <defs>
      <clipPath id="icon-dice_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgIconDice;
