import type { SVGProps } from "react";
import * as React from "react";

const SvgIconDebank = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <g clipPath="url(#icon-debank_svg__a)">
      <g opacity={0.8}>
        <mask
          id="icon-debank_svg__b"
          width={16}
          height={18}
          x={2}
          y={1}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M17.33 1.668H2.67v16.667h14.66z" />
        </mask>
        <g mask="url(#icon-debank_svg__b)">
          <path
            fill="#FE815F"
            d="M17.33 13.335c0 2.762-2.271 5-5.074 5H2.67v-3.333h9.586a1.68 1.68 0 0 0 1.69-1.667 1.68 1.68 0 0 0-1.69-1.667H8.872V8.336h3.384a1.68 1.68 0 0 0 1.69-1.667 1.68 1.68 0 0 0-1.69-1.667H2.67V1.668h9.586c2.803 0 5.074 2.238 5.074 5 0 1.28-.488 2.449-1.291 3.334a4.94 4.94 0 0 1 1.291 3.333"
          />
        </g>
      </g>
      <g opacity={0.12}>
        <mask
          id="icon-debank_svg__c"
          width={11}
          height={18}
          x={2}
          y={1}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M12.82 1.668H2.67v16.667h10.15z" />
        </mask>
        <g mask="url(#icon-debank_svg__c)">
          <path
            fill="#000"
            d="M2.67 15.001h8.233c-1.75 2.024-4.533 3.334-7.67 3.334q-.284 0-.563-.014zm9.958-3.333H9.436V8.334h3.192a7.3 7.3 0 0 1 0 3.334M10.903 5H2.67V1.682q.28-.014.563-.014c3.137 0 5.92 1.31 7.67 3.333"
          />
        </g>
      </g>
      <path
        fill="#FF6238"
        d="M2.67 1.666c4.671 0 8.458 3.731 8.458 8.334s-3.787 8.333-8.458 8.333v-3.334c2.803 0 5.074-2.238 5.074-5s-2.271-5-5.074-5z"
      />
    </g>
    <defs>
      <clipPath id="icon-debank_svg__a">
        <path fill="#fff" d="M2.67 1.666h14.66v16.667H2.67z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgIconDebank;
