import type { SVGProps } from "react";
import * as React from "react";

const SvgSparkles = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g fill={"currentColor"} clipPath="url(#sparkles_svg__a)">
      <path d="M6.667 13.334a.833.833 0 0 0 1.666 0c0-1.924.426-3.12 1.154-3.847.728-.728 1.922-1.153 3.846-1.153a.833.833 0 0 0 0-1.667c-1.924 0-3.118-.426-3.846-1.154-.728-.727-1.154-1.922-1.154-3.846a.833.833 0 1 0-1.666 0c0 1.924-.426 3.119-1.154 3.846-.728.728-1.923 1.154-3.846 1.154a.833.833 0 1 0 0 1.667c1.923 0 3.118.425 3.846 1.153.728.728 1.154 1.923 1.154 3.847ZM13.75 18.334a.833.833 0 0 0 1.667 0c0-1.2.266-1.875.654-2.263.388-.388 1.062-.654 2.262-.654a.833.833 0 0 0 0-1.667c-1.2 0-1.874-.266-2.262-.654-.388-.388-.654-1.062-.654-2.262a.833.833 0 0 0-1.667 0c0 1.2-.267 1.874-.654 2.262-.388.388-1.062.654-2.263.654a.833.833 0 1 0 0 1.667c1.2 0 1.875.266 2.263.654.387.388.654 1.062.654 2.262Z" />
    </g>
    <defs>
      <clipPath id="sparkles_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgSparkles;
