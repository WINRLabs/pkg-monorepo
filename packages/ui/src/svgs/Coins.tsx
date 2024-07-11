import type { SVGProps } from "react";
import * as React from "react";

const SvgCoins = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.083 4.167a3.75 3.75 0 0 1 .342 7.484l.15 1.66a5.417 5.417 0 1 0-5.886-5.886l1.66.15a3.75 3.75 0 0 1 3.734-3.408Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7.917 8.333a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm5.416 3.75a5.417 5.417 0 1 0-10.833 0 5.417 5.417 0 0 0 10.833 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgCoins;
