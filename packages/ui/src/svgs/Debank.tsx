import type { SVGProps } from "react";
import * as React from "react";

const SvgDebank = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <g clipPath="url(#debank_svg__a)">
      <g opacity={0.8}>
        <mask
          id="debank_svg__b"
          width={16}
          height={18}
          x={2}
          y={1}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M17.33 1.669H2.67v16.667h14.66V1.669Z" />
        </mask>
        <g mask="url(#debank_svg__b)">
          <path
            fill="#FE815F"
            d="M17.33 13.336c0 2.762-2.271 5-5.074 5H2.67v-3.333h9.586a1.68 1.68 0 0 0 1.691-1.667 1.68 1.68 0 0 0-1.691-1.667H8.872V8.336h3.384a1.68 1.68 0 0 0 1.691-1.667 1.68 1.68 0 0 0-1.691-1.667H2.67V1.67h9.586c2.803 0 5.075 2.238 5.075 5 0 1.28-.488 2.449-1.292 3.334a4.94 4.94 0 0 1 1.292 3.333Z"
          />
        </g>
      </g>
      <g opacity={0.12}>
        <mask
          id="debank_svg__c"
          width={11}
          height={18}
          x={2}
          y={1}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M12.82 1.669H2.67v16.667h10.15V1.669Z" />
        </mask>
        <g mask="url(#debank_svg__c)">
          <path
            fill="#000"
            d="M2.67 15.002h8.234c-1.75 2.024-4.534 3.334-7.67 3.334-.19 0-.378-.005-.564-.014v-3.32Zm9.958-3.333H9.436V8.335h3.192a7.331 7.331 0 0 1 0 3.334Zm-1.724-6.667H2.67V1.683c.186-.01.375-.014.564-.014 3.136 0 5.92 1.31 7.67 3.333"
          />
        </g>
      </g>
      <path
        fill="#FF6238"
        d="M2.67 1.668c4.672 0 8.458 3.731 8.458 8.334 0 4.602-3.786 8.333-8.458 8.333V15c2.803 0 5.075-2.238 5.075-5S5.473 5 2.67 5V1.668Z"
      />
    </g>
    <defs>
      <clipPath id="debank_svg__a">
        <path fill="#fff" d="M2.67 1.667h14.66v16.667H2.67z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgDebank;
