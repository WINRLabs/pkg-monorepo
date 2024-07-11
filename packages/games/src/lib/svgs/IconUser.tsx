import type { SVGProps } from "react";
import * as React from "react";

const SvgIconUser = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM12 12c-3.358 0-6.037 1.766-7.447 4.389-.63 1.17-.392 2.385.305 3.252C5.531 20.48 6.624 21 7.795 21h8.41c1.172 0 2.264-.52 2.937-1.359.698-.867.935-2.082.306-3.252C18.038 13.766 15.358 12 12 12Z"
    />
  </svg>
);

export default SvgIconUser;
