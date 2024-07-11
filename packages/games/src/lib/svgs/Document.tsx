import type { SVGProps } from "react";
import * as React from "react";

const SvgDocument = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.333 4.167a2.5 2.5 0 0 1 2.5-2.5h8.334a2.5 2.5 0 0 1 2.5 2.5v11.667a2.5 2.5 0 0 1-2.5 2.5H5.833a2.5 2.5 0 0 1-2.5-2.5V4.167ZM7.5 5a.833.833 0 0 0 0 1.667h5A.833.833 0 0 0 12.5 5h-5Zm0 3.334A.833.833 0 0 0 7.5 10h5a.833.833 0 0 0 0-1.666h-5Zm0 3.333a.833.833 0 0 0 0 1.667h1.667a.833.833 0 0 0 0-1.667H7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgDocument;
