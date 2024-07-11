import type { SVGProps } from "react";
import * as React from "react";

const SvgBigClubs = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={36}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M15.5 14.09A7.045 7.045 0 1 0 15.5 0a7.045 7.045 0 0 0 0 14.09ZM7.046 28.183a7.045 7.045 0 1 0 0-14.09 7.045 7.045 0 0 0 0 14.09ZM31 21.136a7.045 7.045 0 1 1-14.09 0 7.045 7.045 0 0 1 14.09 0Zm-5.536 14.091a17.686 17.686 0 0 1-9.964-9.963 17.686 17.686 0 0 1-9.964 9.963h19.928Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgBigClubs;
