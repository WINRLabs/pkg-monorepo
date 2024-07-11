import type { SVGProps } from "react";
import * as React from "react";

const SvgSmallSpades = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={14}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M2.813 13.171a5.794 5.794 0 0 0 3.264-3.264 5.794 5.794 0 0 0 3.264 3.264H2.813ZM.957 5.998a2.962 2.962 0 1 0 4.19 4.19l.897-.898.898.898a2.962 2.962 0 1 0 4.189-4.19l-.898-.897L6.044.91l-4.189 4.19-.898.897Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgSmallSpades;
