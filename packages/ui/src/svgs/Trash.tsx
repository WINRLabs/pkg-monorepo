import type { SVGProps } from "react";
import * as React from "react";

const SvgTrash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillOpacity={0.5}
      fillRule="evenodd"
      d="M6.182 4.166a4.167 4.167 0 0 1 7.639 0h3.68a.833.833 0 0 1 0 1.667h-.887l-.781 11.722a.833.833 0 0 1-.832.778h-10a.833.833 0 0 1-.831-.778L3.388 5.833h-.887a.833.833 0 1 1 0-1.667h3.68Zm1.956 0A2.495 2.495 0 0 1 10 3.333c.74 0 1.406.321 1.864.833H8.138Zm1.03 5a.833.833 0 1 0-1.667 0v4.167a.833.833 0 0 0 1.667 0V9.166Zm2.5-.833c.46 0 .833.373.833.833v4.167a.833.833 0 0 1-1.666 0V9.166c0-.46.373-.833.833-.833Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgTrash;
