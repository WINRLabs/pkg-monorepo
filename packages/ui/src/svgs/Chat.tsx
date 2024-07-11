import type { SVGProps } from "react";
import * as React from "react";

const SvgChat = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      viewBox="0 0 20 20"
      fill="currentColor"
      fillRule="evenodd"
      d="M5.002 2.5h10a3.333 3.333 0 0 1 3.333 3.333v6.697a3.333 3.333 0 0 1-3.333 3.333h-2.189l-2.283 1.892a.833.833 0 0 1-1.067-.003L7.21 15.863H5.002a3.333 3.333 0 0 1-3.334-3.333V5.833A3.333 3.333 0 0 1 5.002 2.5Zm.206 6.667a1.042 1.042 0 1 0 2.084 0 1.042 1.042 0 0 0-2.084 0Zm3.75 0a1.042 1.042 0 1 0 2.084 0 1.042 1.042 0 0 0-2.084 0Zm4.792 1.041a1.042 1.042 0 1 1 0-2.083 1.042 1.042 0 0 1 0 2.083Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgChat;
