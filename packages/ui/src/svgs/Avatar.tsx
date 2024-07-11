import type { SVGProps } from "react";
import * as React from "react";

const SvgAvatar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <g fill="currentColor">
      <path d="M9 2a3.15 3.15 0 1 0 0 6.3A3.15 3.15 0 0 0 9 2ZM9 9c-2.35 0-4.226 1.236-5.213 3.072-.44.82-.275 1.67.214 2.277.471.586 1.236.951 2.056.951h5.886c.82 0 1.585-.365 2.056-.951.489-.607.655-1.458.214-2.277C13.226 10.236 11.35 9 9 9Z" />
    </g>
  </svg>
);

export default SvgAvatar;
