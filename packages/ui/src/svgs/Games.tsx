import type { SVGProps } from "react";
import * as React from "react";

const SvgGames = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 21"
    fill="currentColor"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.667 4.754a5.833 5.833 0 1 0 0 11.667h6.666a5.833 5.833 0 0 0 0-11.667H6.667Zm7.083 4.583a1.042 1.042 0 1 0 2.083 0 1.042 1.042 0 0 0-2.083 0Zm-2.5 2.5a1.042 1.042 0 1 0 2.083 0 1.042 1.042 0 0 0-2.083 0ZM7.5 8.921a.833.833 0 0 0-1.667 0v.833H5a.833.833 0 1 0 0 1.667h.833v.833a.833.833 0 0 0 1.667 0v-.833h.833a.833.833 0 0 0 0-1.667H7.5V8.92Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgGames;
