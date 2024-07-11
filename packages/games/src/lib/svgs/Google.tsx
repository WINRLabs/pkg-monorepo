import type { SVGProps } from "react";
import * as React from "react";

const SvgGoogle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <g clipPath="url(#google_svg__a)">
      <path
        fill="#4285F4"
        d="M10 8.182v3.872h5.382a4.611 4.611 0 0 1-2.01 3.01l3.246 2.518c1.89-1.746 2.982-4.31 2.982-7.355 0-.709-.064-1.39-.182-2.045H10Z"
      />
      <path
        fill="#34A853"
        d="m4.396 11.903-.732.56-2.591 2.019C2.718 17.745 6.09 20 10 20c2.7 0 4.963-.89 6.618-2.418l-3.246-2.518c-.89.6-2.027.963-3.372.963-2.6 0-4.81-1.754-5.6-4.118l-.004-.006Z"
      />
      <path
        fill="#FBBC05"
        d="M1.073 5.518A9.877 9.877 0 0 0 0 10c0 1.618.39 3.136 1.073 4.482C1.073 14.49 4.4 11.9 4.4 11.9c-.2-.6-.318-1.237-.318-1.9 0-.664.118-1.3.318-1.9L1.073 5.518Z"
      />
      <path
        fill="#EA4335"
        d="M10 3.982c1.473 0 2.782.509 3.827 1.49l2.864-2.863C14.955.991 12.7 0 10 0 6.09 0 2.718 2.245 1.073 5.518L4.4 8.1c.79-2.364 3-4.118 5.6-4.118Z"
      />
    </g>
    <defs>
      <clipPath id="google_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgGoogle;
