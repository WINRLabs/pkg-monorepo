import type { SVGProps } from "react";
import * as React from "react";

const SvgIconQuestionMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#71717A"
      fillRule="evenodd"
      d="M10 1.667a8.333 8.333 0 1 0 0 16.666 8.333 8.333 0 0 0 0-16.666ZM10 7.5a.833.833 0 0 0-.732.435.833.833 0 0 1-1.462-.8A2.5 2.5 0 0 1 10 5.833c1.262 0 2.14.839 2.389 1.824.25.991-.13 2.146-1.271 2.716a.515.515 0 0 0-.285.46.833.833 0 1 1-1.666 0c0-.826.467-1.581 1.206-1.951.379-.19.476-.516.4-.815-.077-.305-.333-.567-.773-.567Zm0 6.667a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconQuestionMark;
