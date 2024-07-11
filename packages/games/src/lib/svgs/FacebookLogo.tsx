import type { SVGProps } from "react";
import * as React from "react";

const SvgFacebookLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M8.01 1.333a6.667 6.667 0 0 0-6.667 6.666c0 3.21 2.296 5.926 5.334 6.537V9.999H5.342V8h1.333V6a2.004 2.004 0 0 1 2-2h2v2H9.343a.673.673 0 0 0-.667.667v1.333h2l-.667 2H8.676l.005 4.641c3.354-.348 5.995-3.194 5.995-6.64A6.667 6.667 0 0 0 8.01 1.332Z"
    />
  </svg>
);

export default SvgFacebookLogo;
