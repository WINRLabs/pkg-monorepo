import type { SVGProps } from "react";
import * as React from "react";

const SvgDiceIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <g clipPath="url(#dice-icon_svg__a)">
      <path
        fill="currentColor"
        d="M15.833 8.089h-4.166A4.172 4.172 0 0 0 7.5 12.256v4.166a4.172 4.172 0 0 0 4.167 4.167h4.166A4.172 4.172 0 0 0 20 16.422v-4.166a4.172 4.172 0 0 0-4.167-4.167Zm-4.166 5a.833.833 0 1 1 0-1.667.833.833 0 0 1 0 1.667Zm4.166 4.167a.833.833 0 1 1 0-1.666.833.833 0 0 1 0 1.666ZM13 4.756l-2.943-2.949a4.172 4.172 0 0 0-5.89 0L1.218 4.756a4.172 4.172 0 0 0 0 5.892l2.949 2.941a4.134 4.134 0 0 0 1.666 1.02v-2.353a5.84 5.84 0 0 1 5.834-5.834h2.356A4.133 4.133 0 0 0 13 4.756ZM4.167 8.922a.833.833 0 1 1 0-1.666.833.833 0 0 1 0 1.666ZM7.5 5.59a.833.833 0 1 1 0-1.667.833.833 0 0 1 0 1.667Z"
      />
    </g>
    <defs>
      <clipPath id="dice-icon_svg__a">
        <path fill="#fff" d="M0 .589h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgDiceIcon;
