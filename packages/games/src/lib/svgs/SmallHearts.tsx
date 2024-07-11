import type { SVGProps } from "react";
import * as React from "react";

const SvgSmallHearts = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={12}
    fill="none"
    {...props}
  >
    <path
      fill="#D9113A"
      fillRule="evenodd"
      d="M.991 1.231a3.208 3.208 0 0 0 0 4.538l.973.972L6.5 11.278l4.537-4.537.972-.972A3.208 3.208 0 1 0 7.473 1.23l-.972.973-.972-.973a3.208 3.208 0 0 0-4.538 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgSmallHearts;
