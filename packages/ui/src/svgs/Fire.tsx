import type { SVGProps } from "react";
import * as React from "react";

const SvgFire = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 17"
    fill="currentColor"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.381.703C6.868.007 7.846-.244 8.61.281c.793.545 2.164 1.599 3.345 3.078 1.18 1.479 2.213 3.44 2.213 5.778 0 4.165-3.127 7.5-7.084 7.5-3.956 0-7.083-3.335-7.083-7.5 0-1.696.728-3.863 2.148-5.593.622-.758 1.695-.713 2.322-.11L6.381.702Zm.702 14.268c1.208 0 2.188-1.118 2.188-2.497 0-1.48-1.151-2.569-1.783-3.055a.657.657 0 0 0-.809 0c-.632.486-1.783 1.575-1.783 3.055 0 1.379.98 2.497 2.187 2.497Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgFire;
