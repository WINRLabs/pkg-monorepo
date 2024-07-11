import type { SVGProps } from "react";
import * as React from "react";

const SvgIconSwitchHorizontal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.744 1.91a.833.833 0 0 1 1.179 0l3.333 3.333a.833.833 0 0 1 0 1.179l-3.333 3.333a.833.833 0 0 1-1.179-1.178l1.91-1.911H3.335a.833.833 0 0 1 0-1.667h11.32l-1.91-1.91a.833.833 0 0 1 0-1.179Zm-5.488 8.333a.833.833 0 0 1 0 1.179l-1.91 1.91h11.32a.833.833 0 0 1 0 1.667H5.347l1.91 1.911a.833.833 0 1 1-1.179 1.179l-3.333-3.334a.833.833 0 0 1 0-1.178l3.333-3.334a.833.833 0 0 1 1.179 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconSwitchHorizontal;
