import type { SVGProps } from "react";
import * as React from "react";

const SvgUndo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillOpacity={0.5}
      d="M6.504 4.757a.833.833 0 1 0-1.179-1.179l-2.45 2.45a2.083 2.083 0 0 0 0 2.946l2.45 2.45a.833.833 0 1 0 1.179-1.18l-1.911-1.91h9.655a2.917 2.917 0 1 1 0 5.833h-3.75a.833.833 0 0 0 0 1.667h3.75a4.583 4.583 0 1 0 0-9.167H4.593l1.91-1.91Z"
    />
  </svg>
);

export default SvgUndo;
