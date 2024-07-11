import type { SVGProps } from "react";
import * as React from "react";

const SvgMinesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 23"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M10.377 2.833a9.865 9.865 0 1 0 9.34 9.34l-9.302-9.31-.038-.03ZM23.212.987h-.75a4.899 4.899 0 0 0-3.068 1.073 3.514 3.514 0 0 0-.443.382l-.75.75L15.823.86a.84.84 0 0 0-.586-.24.855.855 0 0 0-.585.24l-1.95 1.958 7.037 7.037 1.958-1.95a.855.855 0 0 0 .24-.585.84.84 0 0 0-.24-.586l-2.363-2.355.75-.75c.137-.137.285-.263.442-.376a3.368 3.368 0 0 1 1.898-.6h.75a.825.825 0 0 0 0-1.65l.038-.015Z"
    />
  </svg>
);

export default SvgMinesIcon;
