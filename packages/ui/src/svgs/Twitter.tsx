import type { SVGProps } from "react";
import * as React from "react";

const SvgTwitter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M15.272 1.586h2.811l-6.142 7.02 7.226 9.552h-5.658l-4.43-5.793-5.07 5.793H1.194l6.57-7.508L.832 1.586h5.801l4.005 5.296 4.633-5.296Zm-.987 14.89h1.558L5.788 3.18H4.116l10.17 13.294Z"
    />
  </svg>
);

export default SvgTwitter;
