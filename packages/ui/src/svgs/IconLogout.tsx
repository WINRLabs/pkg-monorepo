import type { SVGProps } from "react";
import * as React from "react";

const SvgIconLogout = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.833 4.167c-.92 0-1.666.746-1.666 1.666v8.334c0 .92.746 1.666 1.666 1.666h3.542a.833.833 0 0 1 0 1.667H5.833A3.333 3.333 0 0 1 2.5 14.167V5.833A3.333 3.333 0 0 1 5.833 2.5h3.542a.833.833 0 0 1 0 1.667H5.833Zm6.494 1.494a.833.833 0 0 1 1.179 0l3.75 3.75a.833.833 0 0 1 0 1.178l-3.75 3.75a.833.833 0 0 1-1.179-1.178l2.328-2.328H7.292a.833.833 0 1 1 0-1.666h7.363l-2.328-2.328a.833.833 0 0 1 0-1.178Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconLogout;
