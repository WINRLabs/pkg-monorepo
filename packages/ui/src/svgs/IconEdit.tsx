import type { SVGProps } from "react";
import * as React from "react";

const SvgIconEdit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#71717A"
      d="M12.12 2.953a3.485 3.485 0 1 1 4.928 4.928l-9.965 9.965a1.667 1.667 0 0 1-1.178.488H2.5a.833.833 0 0 1-.833-.834v-3.404c0-.442.175-.866.488-1.179L10.072 5 15 9.93 16.18 8.75 11.25 3.822l.87-.87Z"
    />
  </svg>
);

export default SvgIconEdit;
