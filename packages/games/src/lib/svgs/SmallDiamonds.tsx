import type { SVGProps } from "react";
import * as React from "react";

const SvgSmallDiamonds = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    fill="none"
    {...props}
  >
    <path
      fill="#D9113A"
      fillRule="evenodd"
      d="M6.255 12.379A10 10 0 0 0 .621 6.745L0 6.5l.621-.245A10 10 0 0 0 6.255.621L6.5 0l.245.621a10 10 0 0 0 5.634 5.634L13 6.5l-.621.245a10 10 0 0 0-5.634 5.634L6.5 13l-.245-.621Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgSmallDiamonds;
