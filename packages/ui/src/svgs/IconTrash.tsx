import type { SVGProps } from "react";
import * as React from "react";

const SvgIconTrash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.68 4.167a4.167 4.167 0 0 1 7.64 0H18a.833.833 0 1 1 0 1.667h-.887l-.781 11.722a.833.833 0 0 1-.832.778h-10a.833.833 0 0 1-.831-.778L3.887 5.834H3a.833.833 0 1 1 0-1.667h3.68Zm1.957 0a2.495 2.495 0 0 1 1.863-.833c.74 0 1.406.321 1.864.833H8.637Zm1.03 5a.833.833 0 0 0-1.667 0v4.167a.833.833 0 0 0 1.667 0V9.167Zm2.5-.833c.46 0 .833.373.833.833v4.167a.833.833 0 0 1-1.666 0V9.167c0-.46.373-.833.833-.833Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconTrash;
