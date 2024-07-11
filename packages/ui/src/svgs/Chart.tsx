import type { SVGProps } from "react";
import * as React from "react";

const SvgChart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <path
      fill="#A1A1AA"
      fillRule="evenodd"
      d="M1.3 3.403a.7.7 0 0 1 .7-.7h14a.7.7 0 0 1 0 1.4h-.7v8.4a.7.7 0 0 1-.7.7h-4.292l.674 1.012a.7.7 0 0 1-1.165.776L9 13.765l-.818 1.226a.7.7 0 1 1-1.165-.776l.675-1.012H3.4a.7.7 0 0 1-.7-.7v-8.4H2a.7.7 0 0 1-.7-.7Zm8.4 2.8a.7.7 0 1 0-1.4 0v3.5a.7.7 0 0 0 1.4 0v-3.5Zm2.8 1.4a.7.7 0 1 0-1.4 0v2.1a.7.7 0 0 0 1.4 0v-2.1Zm-5.6 1.4a.7.7 0 1 0-1.4 0v.7a.7.7 0 0 0 1.4 0v-.7Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgChart;
