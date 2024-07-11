import type { SVGProps } from "react";
import * as React from "react";

const SvgIconMines = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={19}
    viewBox="0 0 20 19"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8.648 1.844a8.221 8.221 0 1 0 7.783 7.784L8.68 1.869l-.031-.025ZM19.344.306h-.626a4.082 4.082 0 0 0-2.557.894 2.932 2.932 0 0 0-.369.32l-.625.624L13.185.2a.7.7 0 0 0-.487-.2.713.713 0 0 0-.488.2l-1.625 1.632 5.864 5.864 1.632-1.626a.713.713 0 0 0 .2-.487.7.7 0 0 0-.2-.488l-1.97-1.963.625-.625c.115-.114.238-.219.37-.313a2.807 2.807 0 0 1 1.581-.5h.625a.688.688 0 0 0 0-1.375l.032-.013Z"
    />
  </svg>
);

export default SvgIconMines;
