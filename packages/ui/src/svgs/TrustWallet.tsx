import type { SVGProps } from "react";
import * as React from "react";

const SvgTrustWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <g fill="#fff" clipPath="url(#trust-wallet_svg__a)">
      <path d="M1.667 5.898a4.232 4.232 0 0 1 4.232-4.231h8.203a4.232 4.232 0 0 1 4.231 4.231v8.203a4.232 4.232 0 0 1-4.231 4.232H5.899a4.232 4.232 0 0 1-4.232-4.232V5.898Z" />
      <path
        stroke="#3375BB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.367}
        d="M10.005 5.166c1.681 1.404 3.61 1.318 4.16 1.318-.12 7.987-1.038 6.403-4.16 8.643-3.122-2.24-4.035-.656-4.155-8.643.545 0 2.473.086 4.155-1.318Z"
      />
    </g>
    <defs>
      <clipPath id="trust-wallet_svg__a">
        <path fill="#fff" d="M1.667 1.667h16.667v16.667H1.667z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgTrustWallet;
