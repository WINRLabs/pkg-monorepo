import type { SVGProps } from "react";
import * as React from "react";

const SvgVideoPokerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <g clipPath="url(#video-poker-icon_svg__a)">
      <path
        fill="currentColor"
        d="m19.833 7.385-2.844 8.667a4.121 4.121 0 0 1-2.46 2.666A5.809 5.809 0 0 0 15 16.422V8.088a5.84 5.84 0 0 0-5.833-5.833H7.779A4.18 4.18 0 0 1 12.317.773l4.738 1.455a4.184 4.184 0 0 1 2.778 5.157Zm-6.5.703v8.334a4.171 4.171 0 0 1-4.166 4.166h-5A4.171 4.171 0 0 1 0 16.422V8.088a4.172 4.172 0 0 1 4.167-4.166h5a4.172 4.172 0 0 1 4.166 4.166ZM10 11.422a1.667 1.667 0 0 0-3.333 0 1.667 1.667 0 0 0-3.334 0c0 1.208 1.287 2.826 2.262 3.648a1.66 1.66 0 0 0 2.143 0C8.713 14.248 10 12.63 10 11.422Z"
      />
    </g>
    <defs>
      <clipPath id="video-poker-icon_svg__a">
        <path fill="#fff" d="M0 .589h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgVideoPokerIcon;
