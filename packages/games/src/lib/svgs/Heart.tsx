import type { SVGProps } from "react";
import * as React from "react";

const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.342 15.564c5.97-3.346 7.438-7.329 6.316-10.129-.546-1.36-1.69-2.333-3.04-2.634-1.188-.265-2.486.002-3.618.9-1.132-.898-2.43-1.165-3.619-.9-1.35.3-2.493 1.275-3.039 2.634-1.123 2.8.346 6.783 6.316 10.129a.7.7 0 0 0 .684 0Z"
    />
  </svg>
);

export default SvgHeart;
