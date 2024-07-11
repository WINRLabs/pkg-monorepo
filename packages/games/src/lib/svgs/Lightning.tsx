import type { SVGProps } from "react";
import * as React from "react";

const SvgLightning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#71717A"
      d="M12.095 1.666a.833.833 0 0 0-1.518-.474l-7.5 10.833a.833.833 0 0 0 .685 1.308h5v5a.833.833 0 0 0 1.518.474l7.5-10.833a.834.834 0 0 0-.685-1.308h-5v-5Z"
    />
  </svg>
);

export default SvgLightning;
