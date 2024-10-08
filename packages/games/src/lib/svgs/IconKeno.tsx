import type { SVGProps } from 'react';
import * as React from 'react';

const SvgIconKeno = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox=" 0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M14.286 16.504a.556.556 0 0 1-.393.163H6.107a.556.556 0 0 1-.393-.163l-2.218-2.217a.556.556 0 0 1-.163-.393V6.106c0-.147.059-.288.163-.393l2.218-2.217a.556.556 0 0 1 .393-.163h7.786c.147 0 .289.059.393.163l2.218 2.217a.556.556 0 0 1 .163.393v7.785a.556.556 0 0 1-.163.392l-2.218 2.22Zm-7.127-3.587V6.645h1.99V8.85l1.764-2.204h2.16l-2.178 2.616 2.312 3.656H10.94l-1.388-2.312-.404.466v1.846H7.16Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.429 19.756a.833.833 0 0 1-.59.244H4.16a.833.833 0 0 1-.589-.244L.244 16.43A.833.833 0 0 1 0 15.84V4.16c0-.222.088-.434.244-.59L3.571.244A.833.833 0 0 1 4.161 0H15.84c.22 0 .433.088.589.244l3.327 3.326a.833.833 0 0 1 .244.59v11.676c0 .22-.088.433-.244.589l-3.327 3.33Zm-1.071-1.626a.694.694 0 0 1-.492.203H5.134a.694.694 0 0 1-.491-.203L1.87 15.358a.694.694 0 0 1-.203-.49V5.132c0-.184.073-.361.203-.491L4.643 1.87a.694.694 0 0 1 .49-.203h9.733c.185 0 .361.073.491.203l2.773 2.772c.13.13.203.307.203.49v9.731c0 .184-.073.36-.203.491l-2.772 2.776Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconKeno;
