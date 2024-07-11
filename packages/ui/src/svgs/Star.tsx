import type { SVGProps } from "react";
import * as React from "react";

const SvgStar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.631 1.698a.7.7 0 0 0-1.262 0L6.519 5.56l-4.26.56a.7.7 0 0 0-.39 1.202l3.115 2.945-.782 4.206a.7.7 0 0 0 1.02.744L9 13.174l3.777 2.043a.7.7 0 0 0 1.021-.744l-.782-4.206 3.115-2.945a.7.7 0 0 0-.39-1.202l-4.26-.56-1.85-3.862Z"
    />
  </svg>
);

export default SvgStar;
