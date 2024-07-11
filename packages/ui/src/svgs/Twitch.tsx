import type { SVGProps } from "react";
import * as React from "react";

const SvgTwitch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="m17.143 9.286-2.857 2.857H11.43l-2.5 2.5v-2.5H5.715V1.429h11.428v7.857Z"
    />
    <path
      fill="#9146FF"
      d="M5 0 1.43 3.571V16.43h4.285V20l3.571-3.571h2.857L18.573 10V0H5Zm12.143 9.286-2.857 2.857H11.43l-2.5 2.5v-2.5H5.715V1.429h11.428v7.857Z"
    />
    <path
      fill="#9146FF"
      d="M15 3.929h-1.428v4.285h1.429V3.93ZM11.072 3.929H9.643v4.285h1.429V3.93Z"
    />
  </svg>
);

export default SvgTwitch;
