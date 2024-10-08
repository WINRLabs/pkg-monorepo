import type { SVGProps } from 'react';
import * as React from 'react';

const SvgTwitterLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="#fff"
      d="M10.009 1.953C8.075 1.95 6.675 3.57 6.675 5.286c0 0-1.766-.292-3.436-1.772-.264-.234-.532-.228-.564-.228a.671.671 0 0 0-.666.667v1.733c0 .762.244 1.414.636 1.951v.57c0 1.021.392 1.799 1.122 2.207-.195.286-.674.542-1.094.701-.278.106-.532.17-.658.17a.685.685 0 0 0-.672.67c-.002.349.242.52.401.627.259.173.6.277.93.372a8.847 8.847 0 0 0 2.454.332c4.237 0 7.73-3.172 8.17-7.302 0 0 .146-.452.498-.857.352-.405.88-.713.88-.713l-1.277-.029.834-1.168s-1.37.287-1.558.07c-.619-.847-1.707-1.333-2.666-1.334Zm1.333 2a.666.666 0 1 1 .001 1.333.666.666 0 0 1 0-1.333Z"
    />
  </svg>
);

export default SvgTwitterLogo;
