import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../../../../utils'

const iconVariants = cva('stroke-current fill-none')

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  size: '8' | '12' | '16' | '24' | '28' | '48'
  viewBox?: string
}

const SVG: React.FC<SVGProps> = ({ className, size, viewBox, children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    viewBox={`${viewBox ?? '0 0'} ${size} ${size}`}
    {...props}
  >
    {children}
  </svg>
)

export const Icons = {
  'alert/48': (className: string) => (
    <SVG className={className} size="48">
      <path
        d="M26.6258 4.55042C26.3664 4.08102 25.986 3.68972 25.5242 3.41722C25.0624 3.1447 24.536 3.00098 23.9998 3.00098C23.4634 3.00098 22.937 3.1447 22.4752 3.41722C22.0134 3.68972 21.633 4.08102 21.3738 4.55042L1.87369 40.5504C1.62153 41.0072 1.49283 41.5218 1.50031 42.0434C1.50778 42.565 1.65117 43.0758 1.91632 43.525C2.18148 43.9744 2.5592 44.3468 3.01226 44.6056C3.4653 44.8642 3.97798 45.0004 4.4997 45.0004H43.4998C44.0214 45.0004 44.5342 44.8642 44.9872 44.6056C45.4402 44.3468 45.818 43.9744 46.0832 43.525C46.3482 43.0758 46.4916 42.565 46.4992 42.0434C46.5066 41.5218 46.3778 41.0072 46.1258 40.5504L26.6258 4.55042Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M24 30V16.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M24 37.5C23.5858 37.5 23.25 37.1642 23.25 36.75C23.25 36.3358 23.5858 36 24 36"
        strokeWidth="2"
      />
      <path
        d="M24 37.5C24.4142 37.5 24.75 37.1642 24.75 36.75C24.75 36.3358 24.4142 36 24 36"
        strokeWidth="2"
      />
    </SVG>
  ),
  'back/24': (className: string) => (
    <SVG className={className} size="24">
      <path d="M11 22L1 12L11 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 12H23" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'next/24': (className: string) => (
    <SVG className={className} size="24">
      <path d="M13 2L23 12L13 22" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 12L1 12" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'close/24': (className: string) => (
    <SVG className={className} size="24">
      <path d="M22 22L12 12L22 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 2L12 12L2 22" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'card/16': (className: string) => (
    <SVG className={className} size="16">
      <path
        d="M12.29 4.66675H2.37697C1.80068 4.66675 1.3335 5.15177 1.3335 5.75008V12.2501C1.3335 12.8484 1.80068 13.3334 2.37697 13.3334H12.29C12.8663 13.3334 13.3335 12.8484 13.3335 12.2501V5.75008C13.3335 5.15177 12.8663 4.66675 12.29 4.66675Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.3335 6.9231H13.3335" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.3333 8.66675H10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.84042 8.66675H2.6665" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.99984 10.6667H2.6665" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M2.6665 4.65605V3.41659C2.6665 2.81828 3.15964 2.33325 3.76795 2.33325H14.2317C14.84 2.33325 15.3332 2.81828 15.3332 3.41659V9.91659C15.3332 10.5149 14.84 10.9999 14.2317 10.9999H13.4754"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'card/24': (className: string) => (
    <SVG className={className} size="24">
      <path
        d="M18.424 7H3.57214C2.70873 7 2.00879 7.72667 2.00879 8.62307V18.3615C2.00879 19.2579 2.70873 19.9845 3.57214 19.9845H18.424C19.2874 19.9845 19.9874 19.2579 19.9874 18.3615V8.62307C19.9874 7.72667 19.2874 7 18.424 7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.00879 10H19.9874" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.9908 13H14.9932" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2593 13H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00348 16H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.00586 6.48006V4.62307C4.00586 3.72667 4.74468 3 5.65607 3H21.333C22.2444 3 22.9832 3.72667 22.9832 4.62307V14.3615C22.9832 15.2579 22.2444 15.9845 21.333 15.9845H20.1998"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'cardInProgress/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M18.424 9H3.57214C2.70873 9 2.00879 9.72667 2.00879 10.6231V20.3615C2.00879 21.2579 2.70873 21.9845 3.57214 21.9845H18.424C19.2874 21.9845 19.9874 21.2579 19.9874 20.3615V10.6231C19.9874 9.72667 19.2874 9 18.424 9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.00879 12H19.9874" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.9908 15H14.9932" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2593 15H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00348 18H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.00586 8.48006V6.62307C4.00586 5.72667 4.74468 5 5.65607 5H21.333C22.2444 5 22.9832 5.72667 22.9832 6.62307V16.3615C22.9832 17.2579 22.2444 17.9845 21.333 17.9845H20.1998"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="8" r="6" fill="#454D54" stroke="none" />
      <path d="M22 8V6.125" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 8L24.3435 10.344" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'cardFailed/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M18.424 9H3.57214C2.70873 9 2.00879 9.72667 2.00879 10.6231V20.3615C2.00879 21.2579 2.70873 21.9845 3.57214 21.9845H18.424C19.2874 21.9845 19.9874 21.2579 19.9874 20.3615V10.6231C19.9874 9.72667 19.2874 9 18.424 9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.00879 12H19.9874" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.9908 15H14.9932" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2593 15H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00348 18H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.00586 8.48006V6.62307C4.00586 5.72667 4.74468 5 5.65607 5H21.333C22.2444 5 22.9832 5.72667 22.9832 6.62307V16.3615C22.9832 17.2579 22.2444 17.9845 21.333 17.9845H20.1998"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="8" r="6" fill="#F32448" stroke="none" />
      <path d="M19.3335 5.33325L24.6668 10.6666" stroke="white" strokeLinecap="round" />
      <path d="M24.6665 5.33325L19.3332 10.6666" stroke="white" strokeLinecap="round" />
    </SVG>
  ),
  'cardAuthorised/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M18.424 9H3.57214C2.70873 9 2.00879 9.72667 2.00879 10.6231V20.3615C2.00879 21.2579 2.70873 21.9845 3.57214 21.9845H18.424C19.2874 21.9845 19.9874 21.2579 19.9874 20.3615V10.6231C19.9874 9.72667 19.2874 9 18.424 9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.00879 12H19.9874" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.9908 15H14.9932" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2593 15H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00348 18H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.00586 8.48006V6.62307C4.00586 5.72667 4.74468 5 5.65607 5H21.333C22.2444 5 22.9832 5.72667 22.9832 6.62307V16.3615C22.9832 17.2579 22.2444 17.9845 21.333 17.9845H20.1998"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="8" r="6" fill="#454D54" stroke="none" />
      <path
        d="M23.9844 7.95964H23.1889C22.67 7.95964 22.5145 7.63309 22.5145 7.25647C22.5145 6.62852 23.1631 6.24805 23.1631 5.62395C23.1631 5.32586 23.0401 5.03998 22.8211 4.8292C22.6022 4.61842 22.3052 4.5 21.9956 4.5C21.6859 4.5 21.389 4.61842 21.17 4.8292C20.9511 5.03998 20.8281 5.32586 20.8281 5.62395C20.8281 6.24805 21.4766 6.62852 21.4766 7.25647C21.4766 7.63309 21.3212 7.95964 20.8022 7.95964H19.8078C19 7.95964 18.9998 9 19 9.5H25C25 9 25 7.95964 23.9844 7.95964Z"
        fill="white"
        stroke="none"
      />
      <rect x="19" y="10" width="6" height="1" fill="white" stroke="none" />
    </SVG>
  ),
  'cardVoided/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M18.424 9H3.57214C2.70873 9 2.00879 9.72667 2.00879 10.6231V20.3615C2.00879 21.2579 2.70873 21.9845 3.57214 21.9845H18.424C19.2874 21.9845 19.9874 21.2579 19.9874 20.3615V10.6231C19.9874 9.72667 19.2874 9 18.424 9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.00879 12H19.9874" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.9908 15H14.9932" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2593 15H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00348 18H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.00586 8.48006V6.62307C4.00586 5.72667 4.74468 5 5.65607 5H21.333C22.2444 5 22.9832 5.72667 22.9832 6.62307V16.3615C22.9832 17.2579 22.2444 17.9845 21.333 17.9845H20.1998"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="8" r="6" fill="#454D54" stroke="none" />
      <path
        d="M18.6665 8.00008C18.6665 8.88414 19.0177 9.73198 19.6428 10.3571C20.2679 10.9822 21.1158 11.3334 21.9998 11.3334C22.8839 11.3334 23.7317 10.9822 24.3569 10.3571C24.982 9.73198 25.3332 8.88414 25.3332 8.00008C25.3332 7.11603 24.982 6.26818 24.3569 5.64306C23.7317 5.01794 22.8839 4.66675 21.9998 4.66675C21.1158 4.66675 20.2679 5.01794 19.6428 5.64306C19.0177 6.26818 18.6665 7.11603 18.6665 8.00008Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M24 6L20 10" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'cardPaid/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M18.424 9H3.57214C2.70873 9 2.00879 9.72667 2.00879 10.6231V20.3615C2.00879 21.2579 2.70873 21.9845 3.57214 21.9845H18.424C19.2874 21.9845 19.9874 21.2579 19.9874 20.3615V10.6231C19.9874 9.72667 19.2874 9 18.424 9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.00879 12H19.9874" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.9908 15H14.9932" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2593 15H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00348 18H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.00586 8.48006V6.62307C4.00586 5.72667 4.74468 5 5.65607 5H21.333C22.2444 5 22.9832 5.72667 22.9832 6.62307V16.3615C22.9832 17.2579 22.2444 17.9845 21.333 17.9845H20.1998"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="8" r="6" fill="#29A37A" stroke="none" />
      <path
        d="M25.1667 5.66667L20.8333 10L19 8.16667"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'cardRefunded/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M18.424 9H3.57214C2.70873 9 2.00879 9.72667 2.00879 10.6231V20.3615C2.00879 21.2579 2.70873 21.9845 3.57214 21.9845H18.424C19.2874 21.9845 19.9874 21.2579 19.9874 20.3615V10.6231C19.9874 9.72667 19.2874 9 18.424 9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.00879 12H19.9874" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.9908 15H14.9932" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2593 15H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00348 18H4.00586" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.00586 8.48006V6.62307C4.00586 5.72667 4.74468 5 5.65607 5H21.333C22.2444 5 22.9832 5.72667 22.9832 6.62307V16.3615C22.9832 17.2579 22.2444 17.9845 21.333 17.9845H20.1998"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="8" r="6" fill="#454D54" stroke="none" />
      <path
        d="M20.625 10.4368L19.5 9.31177L20.625 8.18677"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.75 9.31177H22.6875C23.1848 9.31177 23.6617 9.11422 24.0133 8.76259C24.365 8.41096 24.5625 7.93405 24.5625 7.43677C24.5625 6.93949 24.365 6.46257 24.0133 6.11094C23.6617 5.75931 23.1848 5.56177 22.6875 5.56177H21.1875"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'bankInProgress/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M3 23L3.75943 20.3415C3.78784 20.2422 3.84236 20.1557 3.91528 20.0944C3.98819 20.0331 4.0758 20.0001 4.16571 20H19.8343C19.9242 20.0001 20.0118 20.0331 20.0847 20.0944C20.1576 20.1557 20.2122 20.2422 20.2406 20.3415L21 22.996"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 12H19V20H5V12Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 23H2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M20.9778 9.66065C21.0094 9.56246 21.0072 9.45597 20.9715 9.35928C20.9359 9.26258 20.869 9.18166 20.7822 9.13025L12.2181 4.06002C12.1523 4.0207 12.0777 4 12.0017 4C11.9258 4 11.8512 4.0207 11.7854 4.06002L3.21777 9.12666C3.131 9.17807 3.06411 9.259 3.02846 9.35569C2.9928 9.45239 2.99059 9.55888 3.02219 9.65707L3.68336 11.6936C3.71205 11.7827 3.7671 11.8603 3.84071 11.9153C3.91433 11.9703 4.00279 11.9999 4.09357 12H19.9134C20.0041 11.9999 20.0926 11.9703 20.1662 11.9153C20.2398 11.8603 20.2949 11.7827 20.3236 11.6936L20.9778 9.66065Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 9.5H3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="8" r="6" fill="#454D54" stroke="none" />
      <path d="M22 8V6.125" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 8L24.3435 10.344" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'bankFailed/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M3 23L3.75943 20.3415C3.78784 20.2422 3.84236 20.1557 3.91528 20.0944C3.98819 20.0331 4.0758 20.0001 4.16571 20H19.8343C19.9242 20.0001 20.0118 20.0331 20.0847 20.0944C20.1576 20.1557 20.2122 20.2422 20.2406 20.3415L21 22.996"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 12H19V20H5V12Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 23H2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M20.9778 9.66065C21.0094 9.56246 21.0072 9.45597 20.9715 9.35928C20.9359 9.26258 20.869 9.18166 20.7822 9.13025L12.2181 4.06002C12.1523 4.0207 12.0777 4 12.0017 4C11.9258 4 11.8512 4.0207 11.7854 4.06002L3.21777 9.12666C3.131 9.17807 3.06411 9.259 3.02846 9.35569C2.9928 9.45239 2.99059 9.55888 3.02219 9.65707L3.68336 11.6936C3.71205 11.7827 3.7671 11.8603 3.84071 11.9153C3.91433 11.9703 4.00279 11.9999 4.09357 12H19.9134C20.0041 11.9999 20.0926 11.9703 20.1662 11.9153C20.2398 11.8603 20.2949 11.7827 20.3236 11.6936L20.9778 9.66065Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 9.5H3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="8" r="6" fill="#F32448" stroke="none" />
      <path d="M19.3335 5.33337L24.6668 10.6667" stroke="white" strokeLinecap="round" />
      <path d="M24.6665 5.33337L19.3332 10.6667" stroke="white" strokeLinecap="round" />
    </SVG>
  ),
  'bankPaid/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M3 23L3.75943 20.3415C3.78784 20.2422 3.84236 20.1557 3.91528 20.0944C3.98819 20.0331 4.0758 20.0001 4.16571 20H19.8343C19.9242 20.0001 20.0118 20.0331 20.0847 20.0944C20.1576 20.1557 20.2122 20.2422 20.2406 20.3415L21 22.996"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 12H19V20H5V12Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 23H2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M20.9778 9.66065C21.0094 9.56246 21.0072 9.45597 20.9715 9.35928C20.9359 9.26258 20.869 9.18166 20.7822 9.13025L12.2181 4.06002C12.1523 4.0207 12.0777 4 12.0017 4C11.9258 4 11.8512 4.0207 11.7854 4.06002L3.21777 9.12666C3.131 9.17807 3.06411 9.259 3.02846 9.35569C2.9928 9.45239 2.99059 9.55888 3.02219 9.65707L3.68336 11.6936C3.71205 11.7827 3.7671 11.8603 3.84071 11.9153C3.91433 11.9703 4.00279 11.9999 4.09357 12H19.9134C20.0041 11.9999 20.0926 11.9703 20.1662 11.9153C20.2398 11.8603 20.2949 11.7827 20.3236 11.6936L20.9778 9.66065Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 9.5H3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="8" r="6" fill="#29A37A" stroke="none" />
      <path
        d="M25.1667 5.66667L20.8333 10L19 8.16667"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'bankRefunded/28': (className: string) => (
    <SVG className={className} size="28">
      <path
        d="M3 23L3.75943 20.3415C3.78784 20.2422 3.84236 20.1557 3.91528 20.0944C3.98819 20.0331 4.0758 20.0001 4.16571 20H19.8343C19.9242 20.0001 20.0118 20.0331 20.0847 20.0944C20.1576 20.1557 20.2122 20.2422 20.2406 20.3415L21 22.996"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 12H19V20H5V12Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 23H2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 12V20" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M20.9778 9.66065C21.0094 9.56246 21.0072 9.45597 20.9715 9.35928C20.9359 9.26258 20.869 9.18166 20.7822 9.13025L12.2181 4.06002C12.1523 4.0207 12.0777 4 12.0017 4C11.9258 4 11.8512 4.0207 11.7854 4.06002L3.21777 9.12666C3.131 9.17807 3.06411 9.259 3.02846 9.35569C2.9928 9.45239 2.99059 9.55888 3.02219 9.65707L3.68336 11.6936C3.71205 11.7827 3.7671 11.8603 3.84071 11.9153C3.91433 11.9703 4.00279 11.9999 4.09357 12H19.9134C20.0041 11.9999 20.0926 11.9703 20.1662 11.9153C20.2398 11.8603 20.2949 11.7827 20.3236 11.6936L20.9778 9.66065Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 9.5H3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="8" r="6" fill="#454D54" stroke="none" />
      <path
        d="M20.625 10.4368L19.5 9.31177L20.625 8.18677"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.75 9.31177H22.6875C23.1848 9.31177 23.6617 9.11422 24.0133 8.76259C24.365 8.41096 24.5625 7.93405 24.5625 7.43677C24.5625 6.93949 24.365 6.46257 24.0133 6.11094C23.6617 5.75931 23.1848 5.56177 22.6875 5.56177H21.1875"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'bank/24': (className: string) => (
    <SVG className={className} size="24">
      <path
        d="M3 21L3.75943 18.3415C3.78784 18.2422 3.84236 18.1557 3.91528 18.0944C3.98819 18.0331 4.0758 18.0001 4.16571 18H19.8343C19.9242 18.0001 20.0118 18.0331 20.0847 18.0944C20.1576 18.1557 20.2122 18.2422 20.2406 18.3415L21 20.996"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 10H19V18H5V10Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 21H2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 10V18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10V18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10V18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 10V18" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M20.9778 7.66065C21.0094 7.56246 21.0072 7.45597 20.9715 7.35928C20.9359 7.26258 20.869 7.18166 20.7822 7.13025L12.2181 2.06002C12.1523 2.0207 12.0777 2 12.0017 2C11.9258 2 11.8512 2.0207 11.7854 2.06002L3.21777 7.12666C3.131 7.17807 3.06411 7.259 3.02846 7.35569C2.9928 7.45239 2.99059 7.55888 3.02219 7.65707L3.68336 9.69358C3.71205 9.78275 3.7671 9.86032 3.84071 9.91531C3.91433 9.9703 4.00279 9.99993 4.09357 10H19.9134C20.0041 9.99993 20.0926 9.9703 20.1662 9.91531C20.2398 9.86032 20.2949 9.78275 20.3236 9.69358L20.9778 7.66065Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 7.5H3" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'wallets/16': (className: string) => (
    <SVG className={className} size="16">
      <path d="M11.2955 11.6448H2.6665" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M11.3332 8.86948V13.5072C11.3332 13.8147 11.1927 14.1096 10.9427 14.327C10.6926 14.5445 10.3534 14.6666 9.99984 14.6666H3.99984C3.64621 14.6666 3.30708 14.5445 3.05703 14.327C2.80698 14.1096 2.6665 13.8147 2.6665 13.5072V2.49267C2.6665 2.18518 2.80698 1.89027 3.05703 1.67284C3.30708 1.4554 3.64621 1.33325 3.99984 1.33325H8.99984"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.4826 8.46523C13.6821 8.46523 15.4652 6.68214 15.4652 4.48261C15.4652 2.28307 13.6821 0.5 11.4826 0.5C9.28307 0.5 7.5 2.28307 7.5 4.48261C7.5 6.68214 9.28307 8.46523 11.4826 8.46523Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.6774 2.29761H12.3413C11.7618 2.29761 11.206 2.52781 10.7962 2.93759C10.3864 3.34737 10.1562 3.90315 10.1562 4.48267C10.1562 5.06218 10.3864 5.61795 10.7962 6.02773C11.206 6.43751 11.7618 6.66772 12.3413 6.66772H12.6774"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.49756 4.6333H11.7982" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'wallets/24': (className: string) => (
    <SVG className={className} size="24">
      <path d="M16.9435 17.4673H4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17 12.5539V20.2609C17 20.7222 16.7893 21.1645 16.4143 21.4907C16.0391 21.8169 15.5304 22 15 22H6C5.46957 22 4.96086 21.8169 4.58578 21.4907C4.21071 21.1645 4 20.7222 4 20.2609V3.73913C4 3.27789 4.21071 2.83553 4.58578 2.50938C4.96086 2.18323 5.46957 2 6 2H13.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7489 19.9978C10.6114 19.9978 10.5 19.8863 10.5 19.7489C10.5 19.6114 10.6114 19.5 10.7489 19.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.749 19.9978C10.8865 19.9978 10.9979 19.8863 10.9979 19.7489C10.9979 19.6114 10.8865 19.5 10.749 19.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.4783 12.4979C20.7776 12.4979 23.4522 9.82326 23.4522 6.52396C23.4522 3.22466 20.7776 0.550049 17.4783 0.550049C14.179 0.550049 11.5044 3.22466 11.5044 6.52396C11.5044 9.82326 14.179 12.4979 17.4783 12.4979Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.2705 3.24634H18.7664C17.8971 3.24634 17.0635 3.59165 16.4488 4.20632C15.8341 4.82099 15.4888 5.65466 15.4888 6.52393C15.4888 7.3932 15.8341 8.22686 16.4488 8.84153C17.0635 9.4562 17.8971 9.80151 18.7664 9.80151H19.2705"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.501 5.51123H17.9519" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.501 7.53662H17.9519" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'ellipsis/24': (className: string) => (
    <SVG className={cn(className)} size="24">
      <circle cx="12.4998" cy="5.73905" r="0.782717" strokeWidth="1.565" />
      <circle cx="12.4998" cy="12" r="0.782717" strokeWidth="1.565" />
      <circle cx="12.4998" cy="18.2608" r="0.782717" strokeWidth="1.565" />
    </SVG>
  ),
  'close/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M2 2L10 10" strokeLinecap="round" />
      <path d="M10 2L2 10" strokeLinecap="round" />
    </SVG>
  ),
  'close/16': (className: string) => (
    <SVG className={className} size="16">
      <path d="M2 2L14 14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2L2.00001 14" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'back/16': (className: string) => (
    <SVG className={className} size="16">
      <path d="M7.66665 14.5L1 8L7.66665 1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 8H15" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'next/16': (className: string) => (
    <SVG className={className} size="16">
      <path d="M8.33335 1.5L15 8L8.33335 14.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 8L1 8" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'add/16': (className: string) => (
    <SVG className={className} size="16">
      <path d="M1 8H15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 1L8 15" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'return/16': (className: string) => (
    <SVG className={className} size="16">
      <path d="M3.5 14.498L0.5 11.498L3.5 8.49805" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M0.5 11.498H10.5C11.8261 11.498 13.0979 10.9713 14.0355 10.0336C14.9732 9.0959 15.5 7.82413 15.5 6.49805C15.5 5.17196 14.9732 3.9002 14.0355 2.96251C13.0979 2.02483 11.8261 1.49805 10.5 1.49805H6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'void/16': (className: string) => (
    <SVG className={cn(className)} size="16">
      <g clipPath="url(#clip0_8414_22698)">
        <path
          d="M0.5 8C0.5 9.98912 1.29018 11.8968 2.6967 13.3033C4.10322 14.7098 6.01088 15.5 8 15.5C9.98912 15.5 11.8968 14.7098 13.3033 13.3033C14.7098 11.8968 15.5 9.98912 15.5 8C15.5 6.01088 14.7098 4.10322 13.3033 2.6967C11.8968 1.29018 9.98912 0.5 8 0.5C6.01088 0.5 4.10322 1.29018 2.6967 2.6967C1.29018 4.10322 0.5 6.01088 0.5 8Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M13 3L3 13" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_8414_22698">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'capture/16': (className: string) => (
    <SVG className={className} size="16">
      <path
        d="M0.5 8C0.5 9.98912 1.29018 11.8968 2.6967 13.3033C4.10322 14.7098 6.01088 15.5 8 15.5C9.98912 15.5 11.8968 14.7098 13.3033 13.3033C14.7098 11.8968 15.5 9.98912 15.5 8C15.5 6.01088 14.7098 4.10322 13.3033 2.6967C11.8968 1.29018 9.98912 0.5 8 0.5C6.01088 0.5 4.10322 1.29018 2.6967 2.6967C1.29018 4.10322 0.5 6.01088 0.5 8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 5L7.82611 10.5691C7.7445 10.6925 7.64058 10.7946 7.52134 10.8684C7.4021 10.9423 7.27032 10.9862 7.13488 10.9972C6.99945 11.0083 6.8635 10.9862 6.73622 10.9324C6.60893 10.8786 6.49327 10.7945 6.39702 10.6856L4.5 8.52867"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'qr/16': (className: string) => (
    <SVG className={className} size="16">
      <path d="M6.66667 6.66667H4V4H6.66667V6.66667Z" />
      <path d="M12 6.66667H9.33331V4H12V6.66667Z" />
      <path d="M6.66667 12H4V9.33331H6.66667V12Z" />
      <path d="M1.33331 5.99998L1.33331 1.33331L5.99998 1.33331" />
      <path d="M1.33331 10L1.33331 14.6667H5.99998" />
      <path d="M10 1.33331L14.6667 1.33331V5.99998" />
      <path d="M10 14.6667H14.6667V10" />
      <path d="M12.8333 12H9.33331V8.66669" />
      <path d="M11.9973 9.50269V9.16669H12.3333V9.50269H11.9973Z" />
    </SVG>
  ),
  'edit/16': (className: string) => (
    <SVG className={className} size="16">
      <path
        d="M14.7933 1.2066C14.5663 0.980492 14.2967 0.801613 14.0001 0.6803C13.7036 0.558986 13.3859 0.497642 13.0655 0.499811C12.7451 0.501981 12.4282 0.567621 12.1333 0.69294C11.8384 0.818259 11.5713 1.00077 11.3473 1.22993L1.68067 10.8966L0.5 15.4999L5.10333 14.3193L14.77 4.6526C14.9992 4.42864 15.1817 4.1615 15.307 3.8666C15.4323 3.57169 15.498 3.25488 15.5001 2.93447C15.5023 2.61405 15.4409 2.29638 15.3196 1.9998C15.1983 1.70323 15.0194 1.43364 14.7933 1.2066Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.0708 1.50659L14.4935 4.92926" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.6748 2.90259L13.0975 6.32525" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.68066 10.8967L5.10666 14.3161" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'keyboard-return/16': (className: string) => (
    <SVG className={className} size="16">
      <path
        d="M4 9.43254H9C9.79565 9.43254 10.5587 9.11647 11.1213 8.55386C11.6839 7.99125 12 7.22819 12 6.43254V4.93054"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.5 6.93054L4 9.43054L6.5 11.9305" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M3 1.43054H13C13 1.43054 15 1.43054 15 3.43054V13.4305C15 13.4305 15 15.4305 13 15.4305H3C3 15.4305 1 15.4305 1 13.4305V3.43054C1 3.43054 1 1.43054 3 1.43054Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'support/16': (className: string) => (
    <SVG className={className} size="16">
      <g clipPath="url(#clip0_10800_4670)">
        <path
          d="M3 12H2.5C1.96957 12 1.46086 11.7893 1.08579 11.4142C0.710714 11.0391 0.5 10.5304 0.5 10V8C0.5 7.46957 0.710714 6.96086 1.08579 6.58579C1.46086 6.21071 1.96957 6 2.5 6H3C3.13261 6 3.25979 6.05268 3.35355 6.14645C3.44732 6.24022 3.5 6.36739 3.5 6.5V11.5C3.5 11.6326 3.44732 11.7598 3.35355 11.8536C3.25979 11.9473 3.13261 12 3 12Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 12H13C12.8674 12 12.7402 11.9473 12.6464 11.8536C12.5527 11.7598 12.5 11.6326 12.5 11.5V6.5C12.5 6.36739 12.5527 6.24022 12.6464 6.14645C12.7402 6.05268 12.8674 6 13 6H13.5C14.0304 6 14.5391 6.21071 14.9142 6.58579C15.2893 6.96086 15.5 7.46957 15.5 8V10C15.5 10.5304 15.2893 11.0391 14.9142 11.4142C14.5391 11.7893 14.0304 12 13.5 12Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 6C2.5 4.54131 3.07946 3.14236 4.11091 2.11091C5.14236 1.07946 6.54131 0.5 8 0.5C9.45869 0.5 10.8576 1.07946 11.8891 2.11091C12.9205 3.14236 13.5 4.54131 13.5 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 14.5H11.5C12.0304 14.5 12.5391 14.2893 12.9142 13.9142C13.2893 13.5391 13.5 13.0304 13.5 12.5V12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 15.5H8C7.73478 15.5 7.48043 15.3946 7.29289 15.2071C7.10536 15.0196 7 14.7652 7 14.5C7 14.2348 7.10536 13.9804 7.29289 13.7929C7.48043 13.6054 7.73478 13.5 8 13.5H9C9.26522 13.5 9.51957 13.6054 9.70711 13.7929C9.89464 13.9804 10 14.2348 10 14.5C10 14.7652 9.89464 15.0196 9.70711 15.2071C9.51957 15.3946 9.26522 15.5 9 15.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_10800_4670">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'outgoing/16': (className: string) => (
    <SVG className={className} size="16">
      <path
        d="M8 10L8 2M8 2L11 5M8 2L5 5M15 11V12C15 12.5304 14.8033 13.0391 14.4533 13.4142C14.1032 13.7893 13.6284 14 13.1333 14L2.86667 14C2.3716 14 1.8968 13.7893 1.54673 13.4142C1.19667 13.0391 1 12.5304 1 12V11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'payrun/16': (className: string) => (
    <SVG className={className} size="16">
      <g clipPath="url(#clip0_10307_56209)">
        <path
          d="M13.5 8.5V1.5C13.5 1.23478 13.3946 0.98043 13.2071 0.792893C13.0196 0.605357 12.7652 0.5 12.5 0.5H3.5C3.23478 0.5 2.98043 0.605357 2.79289 0.792893C2.60536 0.98043 2.5 1.23478 2.5 1.5V8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6667 7.63999C14.7421 7.58283 14.8317 7.5476 14.9259 7.53819C15.02 7.52878 15.1149 7.54555 15.2 7.58666C15.2847 7.62635 15.3561 7.68959 15.4058 7.7688C15.4554 7.84801 15.4812 7.93985 15.48 8.03333V14.5C15.48 14.7652 15.3747 15.0196 15.1871 15.2071C14.9996 15.3946 14.7453 15.5 14.48 15.5H1.50004C1.23482 15.5 0.980467 15.3946 0.792931 15.2071C0.605394 15.0196 0.500038 14.7652 0.500038 14.5V8.03333C0.498877 7.93985 0.524665 7.84801 0.57432 7.7688C0.623975 7.68959 0.695394 7.62635 0.780038 7.58666C0.86522 7.54555 0.960104 7.52878 1.05422 7.53819C1.14833 7.5476 1.23801 7.58283 1.31337 7.63999L6.7667 11.5733C7.11869 11.8491 7.55292 11.9989 8.00004 11.9989C8.44716 11.9989 8.88139 11.8491 9.23337 11.5733L14.6667 7.63999Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M5 5H11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 7H11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 3H11" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_10307_56209">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'import/16': (className: string) => (
    <SVG className={className} size="16">
      <path
        d="M15.5006 11.666L15.5006 13.666C15.5006 13.9312 15.3953 14.1856 15.2077 14.3731C15.0202 14.5607 14.7658 14.666 14.5006 14.666L1.50061 14.666C1.23539 14.666 0.98104 14.5607 0.793504 14.3731C0.605967 14.1856 0.50061 13.9312 0.50061 13.666L0.50061 11.666"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 8.5L8 11.5L5 8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M7.97487 11L7.97487 5C7.97487 4.20435 7.60612 3.44129 6.94975 2.87868C6.29337 2.31607 5.40313 2 4.47487 2C3.54662 2 2.4751 2 2 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'back/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M6 11L0.999999 6L6 1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 6L11 6" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'copy/12px': (className: string) => (
    <SVG className={className} size="12">
      <path
        d="M8 2.74365V1.54053C8 1.2989 7.80413 1.10303 7.5625 1.10303H1.4375C1.19588 1.10303 1 1.2989 1 1.54053V7.66553C1 7.90716 1.19588 8.10303 1.4375 8.10303H2.64062"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4.54053C4 4.2989 4.19588 4.10303 4.4375 4.10303H10.5625C10.8041 4.10303 11 4.2989 11 4.54053V10.6655C11 10.9072 10.8041 11.103 10.5625 11.103H4.4375C4.19587 11.103 4 10.9072 4 10.6655V4.54053Z"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'check/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M10.75 2.50001L4.24999 9L1.5 6.25001" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'done/12': (className: string) => (
    <SVG className={className} size="12">
      <path
        d="M1.65378 6.81579L4.49588 9.65789L10.6538 3.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'done/16': (className: string) => (
    <SVG className={className} size="16" viewBox="0 -1">
      <path
        d="M2 8.42105L5.78947 12.2105L14 4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'not-started/12': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="12">
      <circle cx="6" cy="6" r="4" />
    </SVG>
  ),
  'partial/12': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="12">
      <path d="M2 10H10L2 2V10Z" />
    </SVG>
  ),
  'cancelled/12': (className: string) => (
    <SVG className={className} size="12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.70712 2.2929C3.3166 1.90237 2.68343 1.90236 2.2929 2.29288C1.90237 2.6834 1.90236 3.31657 2.29288 3.7071L4.58685 6.00112L2.29314 8.29488C1.90262 8.68541 1.90263 9.31858 2.29316 9.7091C2.68369 10.0996 3.31686 10.0996 3.70738 9.70908L6.00104 7.41535L8.2947 9.70908C8.68522 10.0996 9.31839 10.0996 9.70892 9.7091C10.0994 9.31858 10.0995 8.68541 9.70894 8.29489L7.41524 6.00112L9.7092 3.7071C10.0997 3.31657 10.0997 2.6834 9.70918 2.29288C9.31865 1.90236 8.68548 1.90237 8.29497 2.2929L6.00104 4.58689L3.70712 2.2929Z"
      />
    </SVG>
  ),
  'pending/12': (className: string) => (
    <SVG className={className} size="12">
      <path
        d="M0.75 6C0.75 7.39239 1.30312 8.72774 2.28769 9.71231C3.27226 10.6969 4.60761 11.25 6 11.25C7.39239 11.25 8.72774 10.6969 9.71231 9.71231C10.6969 8.72774 11.25 7.39239 11.25 6C11.25 4.60761 10.6969 3.27226 9.71231 2.28769C8.72774 1.30312 7.39239 0.75 6 0.75C4.60761 0.75 3.27226 1.30312 2.28769 2.28769C1.30312 3.27226 0.75 4.60761 0.75 6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 6V4.125" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L8.3435 8.344" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'pending/16': (className: string) => (
    <SVG className={className} size="16" viewBox="0 -2.5">
      <path
        d="M0.75 6C0.75 7.39239 1.30312 8.72774 2.28769 9.71231C3.27226 10.6969 4.60761 11.25 6 11.25C7.39239 11.25 8.72774 10.6969 9.71231 9.71231C10.6969 8.72774 11.25 7.39239 11.25 6C11.25 4.60761 10.6969 3.27226 9.71231 2.28769C8.72774 1.30312 7.39239 0.75 6 0.75C4.60761 0.75 3.27226 1.30312 2.28769 2.28769C1.30312 3.27226 0.75 4.60761 0.75 6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 6V4.125" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L8.3435 8.344" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'capture/12': (className: string) => (
    <SVG className={className} size="12">
      <path
        d="M0.5 6C0.5 7.45869 1.07946 8.85764 2.11091 9.88909C3.14236 10.9205 4.54131 11.5 6 11.5C7.45869 11.5 8.85764 10.9205 9.88909 9.88909C10.9205 8.85764 11.5 7.45869 11.5 6C11.5 4.54131 10.9205 3.14236 9.88909 2.11091C8.85764 1.07946 7.45869 0.5 6 0.5C4.54131 0.5 3.14236 1.07946 2.11091 2.11091C1.07946 3.14236 0.5 4.54131 0.5 6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 4L5.87579 7.71273C5.8175 7.79499 5.74327 7.86304 5.6581 7.91227C5.57293 7.96151 5.4788 7.9908 5.38206 7.99816C5.28532 8.00552 5.18822 7.99078 5.0973 7.95493C5.00638 7.91909 4.92376 7.86298 4.85501 7.79037L3.5 6.35245"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'return/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M3.25 10.8735L1 8.62354L3.25 6.37354" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M1.5 8.62354H7.375C8.36956 8.62354 9.32339 8.22845 10.0267 7.52519C10.7299 6.82192 11.125 5.8681 11.125 4.87354C11.125 3.87897 10.7299 2.92515 10.0267 2.22188C9.32339 1.51862 8.36956 1.12354 7.375 1.12354H4.375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'void/12': (className: string) => (
    <SVG className={className} size="12">
      <g clipPath="url(#clip0_6629_30732)">
        <path
          d="M0.375 6C0.375 7.49184 0.967632 8.92258 2.02252 9.97748C3.07742 11.0324 4.50816 11.625 6 11.625C7.49184 11.625 8.92258 11.0324 9.97748 9.97748C11.0324 8.92258 11.625 7.49184 11.625 6C11.625 4.50816 11.0324 3.07742 9.97748 2.02252C8.92258 0.967632 7.49184 0.375 6 0.375C4.50816 0.375 3.07742 0.967632 2.02252 2.02252C0.967632 3.07742 0.375 4.50816 0.375 6Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.75 2.25L2.25 9.75" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_6629_30732">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'download/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M6 9L6 1" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.125 7.49902L6 9.37402L7.875 7.49902"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 11H11" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'next/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M6 0.999999L11 6L6 11" />
      <path d="M11 6L1 6" />
    </SVG>
  ),
  'arrow-down/8': (className: string) => (
    <SVG className={className} size="8">
      <path d="M0.5 2L4 5.5L7.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'arrow-up/8': (className: string) => (
    <SVG className={className} size="8">
      <path d="M7.5 5.5L4 2L0.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'outgoing/8': (className: string) => (
    <SVG className={className} size="8">
      <path d="M4 0.5L4 7.5" strokeLinecap="round" />
      <path d="M4 7.5L7.5 4" strokeLinecap="round" />
      <path d="M4 7.5L0.5 4" strokeLinecap="round" />
    </SVG>
  ),
  'incoming/8': (className: string) => (
    <SVG className={className} size="8">
      <path d="M4 7.5V0.5" strokeLinecap="round" />
      <path d="M4 0.5L0.5 4" strokeLinecap="round" />
      <path d="M4 0.5L7.5 4" strokeLinecap="round" />
    </SVG>
  ),
  'failed/12': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.86089 2.7929C3.47038 2.40237 2.83721 2.40236 2.44668 2.79288C2.05615 3.1834 2.05614 3.81657 2.44666 4.2071L4.74062 6.50112L2.44692 8.79488C2.0564 9.18541 2.05641 9.81858 2.44694 10.2091C2.83747 10.5996 3.47064 10.5996 3.86115 10.2091L6.15482 7.91535L8.44848 10.2091C8.839 10.5996 9.47217 10.5996 9.8627 10.2091C10.2532 9.81858 10.2532 9.18541 9.86272 8.79489L7.56901 6.50112L9.86298 4.2071C10.2535 3.81657 10.2535 3.1834 9.86296 2.79288C9.47243 2.40236 8.83926 2.40237 8.44874 2.7929L6.15482 5.08689L3.86089 2.7929Z"
      />
    </SVG>
  ),
  'failed/16': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="16" viewBox="0 -1">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.70712 3.2929C4.3166 2.90237 3.68343 2.90236 3.2929 3.29288C2.90237 3.6834 2.90236 4.31657 3.29288 4.7071L6.58719 8.00149L3.29323 11.2955C2.90271 11.6861 2.90272 12.3192 3.29325 12.7098C3.68378 13.1003 4.31694 13.1003 4.70746 12.7097L8.00139 9.41573L11.2953 12.7097C11.6858 13.1003 12.319 13.1003 12.7095 12.7098C13.1001 12.3192 13.1001 11.6861 12.7095 11.2955L9.41558 8.00149L12.7099 4.7071C13.1004 4.31657 13.1004 3.6834 12.7099 3.29288C12.3193 2.90236 11.6862 2.90237 11.2957 3.2929L8.00139 6.58726L4.70712 3.2929Z"
      />
    </SVG>
  ),
  'pending-approval/12': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="12">
      <g clipPath="url(#clip0_7677_15478)">
        <path d="M10.5272 10.25H1.77874C1.7235 10.25 1.67051 10.2719 1.63145 10.311C1.59239 10.3501 1.57044 10.4031 1.57044 10.4583V10.8749C1.57044 11.0406 1.63628 11.1996 1.75347 11.3168C1.87066 11.4339 2.0296 11.4998 2.19533 11.4998H10.1106C10.2763 11.4998 10.4353 11.4339 10.5525 11.3168C10.6697 11.1996 10.7355 11.0406 10.7355 10.8749V10.4583C10.7355 10.4031 10.7135 10.3501 10.6745 10.311C10.6354 10.2719 10.5824 10.25 10.5272 10.25Z" />
        <path d="M10.1105 7.33376C8.5608 7.33376 7.61097 7.09213 7.34435 6.61722C7.07773 6.1423 7.44433 5.39243 7.79011 4.73838C8.01803 4.38928 8.16991 3.9961 8.23586 3.58442C8.24577 3.30822 8.19866 3.03293 8.09749 2.77573C7.99632 2.51854 7.84324 2.28494 7.64781 2.08951C7.45238 1.89407 7.21878 1.741 6.96158 1.63983C6.70438 1.53865 6.4291 1.49155 6.15289 1.50146C5.87653 1.49093 5.60097 1.5376 5.34349 1.63856C5.08601 1.73951 4.85216 1.89256 4.6566 2.08812C4.46104 2.28368 4.30798 2.51753 4.20703 2.77502C4.10608 3.0325 4.0594 3.30806 4.06993 3.58442C4.13533 4.00079 4.28871 4.39844 4.51985 4.75088C4.86562 5.40077 5.25722 6.13814 4.96977 6.61722C4.68232 7.0963 3.74915 7.33376 2.19526 7.33376C1.54538 7.33376 1.15378 8.49189 1.15378 9.00013C1.15378 9.16586 1.21961 9.3248 1.3368 9.44199C1.45399 9.55918 1.61294 9.62502 1.77867 9.62502H10.5271C10.6929 9.62502 10.8518 9.55918 10.969 9.44199C11.0862 9.3248 11.152 9.16586 11.152 9.00013C11.152 8.49189 10.7604 7.33376 10.1105 7.33376Z" />
      </g>
      <defs>
        <clipPath id="clip0_7677_15478">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'pending-approval/16': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="16" viewBox="0 -2">
      <g clipPath="url(#clip0_7890_8618)">
        <path d="M12.8313 12H1.16664C1.09299 12 1.02235 12.0293 0.970261 12.0813C0.918177 12.1334 0.888916 12.2041 0.888916 12.2777V12.8332C0.888916 13.0542 0.976698 13.2661 1.13295 13.4223C1.2892 13.5786 1.50113 13.6664 1.7221 13.6664H12.2758C12.4968 13.6664 12.7087 13.5786 12.8649 13.4223C13.0212 13.2661 13.109 13.0542 13.109 12.8332V12.2777C13.109 12.2041 13.0797 12.1334 13.0276 12.0813C12.9756 12.0293 12.9049 12 12.8313 12Z" />
        <path d="M12.2757 8.11135C10.2094 8.11135 8.94296 7.78919 8.58747 7.15597C8.23198 6.52274 8.72078 5.52292 9.18181 4.65085C9.48571 4.18538 9.68822 3.66114 9.77615 3.11224C9.78936 2.74396 9.72655 2.37692 9.59166 2.03399C9.45676 1.69106 9.25266 1.37959 8.99208 1.11902C8.73151 0.858441 8.42004 0.654341 8.07711 0.519443C7.73418 0.384545 7.36714 0.321742 6.99886 0.334949C6.63038 0.320911 6.26297 0.383144 5.91966 0.517748C5.57635 0.652352 5.26455 0.856425 5.0038 1.11717C4.74305 1.37792 4.53898 1.68972 4.40438 2.03303C4.26977 2.37634 4.20754 2.74375 4.22158 3.11224C4.30877 3.6674 4.51328 4.1976 4.82147 4.66752C5.2825 5.53403 5.80463 6.51719 5.42136 7.15597C5.0381 7.79474 3.79387 8.11135 1.72202 8.11135C0.855504 8.11135 0.333374 9.65552 0.333374 10.3332C0.333374 10.5542 0.421156 10.7661 0.577409 10.9223C0.733661 11.0786 0.945585 11.1664 1.16656 11.1664H12.8312C13.0521 11.1664 13.2641 11.0786 13.4203 10.9223C13.5766 10.7661 13.6644 10.5542 13.6644 10.3332C13.6644 9.65552 13.1422 8.11135 12.2757 8.11135Z" />
      </g>
      <defs>
        <clipPath id="clip0_7890_8618">
          <rect
            width="13.3333"
            height="13.3333"
            fill="white"
            transform="translate(0.333374 0.333008)"
          />
        </clipPath>
      </defs>
    </SVG>
  ),
  'inprogress/12': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="12">
      <g clipPath="url(#clip0_7681_7737)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.01462 6.78418C1.01462 5.4581 1.5414 4.18633 2.47908 3.24865C3.41677 2.31096 4.68854 1.78418 6.01462 1.78418C7.3407 1.78418 8.61247 2.31096 9.55015 3.24865C10.4878 4.18633 11.0146 5.4581 11.0146 6.78418C11.0146 8.11026 10.4878 9.38203 9.55015 10.3197C8.61247 11.2574 7.3407 11.7842 6.01462 11.7842C4.68854 11.7842 3.41677 11.2574 2.47908 10.3197C1.5414 9.38203 1.01462 8.11026 1.01462 6.78418ZM6.63962 4.30318C6.63962 4.13742 6.57377 3.97845 6.45656 3.86124C6.33935 3.74403 6.18038 3.67818 6.01462 3.67818C5.84886 3.67818 5.68989 3.74403 5.57268 3.86124C5.45547 3.97845 5.38962 4.13742 5.38962 4.30318V7.78418C5.38962 8.12918 5.66962 8.40918 6.01462 8.40918H8.01462C8.18038 8.40918 8.33935 8.34333 8.45656 8.22612C8.57377 8.10891 8.63962 7.94994 8.63962 7.78418C8.63962 7.61842 8.57377 7.45945 8.45656 7.34224C8.33935 7.22503 8.18038 7.15918 8.01462 7.15918H6.63962V4.30318Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_7681_7737">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'arrow-up/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M11 8L6 3L1 8" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'arrow-down/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M1 3L6 8L11 3" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'inprogress/16': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="16" viewBox="0 -2">
      <g clipPath="url(#clip0_7890_8905)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.147827 7.37858C0.147827 5.61047 0.850206 3.91478 2.10045 2.66454C3.35069 1.41429 5.04638 0.711914 6.81449 0.711914C8.5826 0.711914 10.2783 1.41429 11.5285 2.66454C12.7788 3.91478 13.4812 5.61047 13.4812 7.37858C13.4812 9.14669 12.7788 10.8424 11.5285 12.0926C10.2783 13.3429 8.5826 14.0452 6.81449 14.0452C5.04638 14.0452 3.35069 13.3429 2.10045 12.0926C0.850206 10.8424 0.147827 9.14669 0.147827 7.37858ZM7.64783 4.07058C7.64783 3.84957 7.56003 3.63761 7.40375 3.48132C7.24747 3.32504 7.03551 3.23725 6.81449 3.23725C6.59348 3.23725 6.38152 3.32504 6.22524 3.48132C6.06896 3.63761 5.98116 3.84957 5.98116 4.07058V8.71191C5.98116 9.17191 6.35449 9.54525 6.81449 9.54525H9.48116C9.70217 9.54525 9.91414 9.45745 10.0704 9.30117C10.2267 9.14489 10.3145 8.93293 10.3145 8.71191C10.3145 8.4909 10.2267 8.27894 10.0704 8.12266C9.91414 7.96638 9.70217 7.87858 9.48116 7.87858H7.64783V4.07058Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_7890_8905">
          <rect
            width="13.3333"
            height="13.3333"
            fill="white"
            transform="translate(0.147827 0.711914)"
          />
        </clipPath>
      </defs>
    </SVG>
  ),
  'authorise/16': (className: string) => (
    <SVG className={cn(className, 'fill-none stroke-current')} size="16" viewBox="0 0">
      <g id="16px/Authorise" clipPath="url(#clip0_8090_3518)">
        <path
          id="Vector"
          d="M14.4533 14.5C14.4533 14.7643 14.3487 15.0178 14.1623 15.2052C13.9759 15.3926 13.723 15.4986 13.4587 15.5H2.52C2.2557 15.4986 2.00272 15.3926 1.81633 15.2052C1.62995 15.0178 1.52533 14.7643 1.52533 14.5V13.5H14.4533V14.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M12.9613 9.49963H10.9726C9.6753 9.49963 9.28664 8.65162 9.28664 7.67362C9.28664 6.04296 10.908 5.05496 10.908 3.43429C10.908 2.66021 10.6005 1.91784 10.0531 1.37048C9.50576 0.823127 8.76338 0.515625 7.9893 0.515625C7.21523 0.515625 6.47285 0.823127 5.9255 1.37048C5.37814 1.91784 5.07064 2.66021 5.07064 3.43429C5.07064 5.05496 6.69197 6.04296 6.69197 7.67362C6.69197 8.65162 6.3033 9.49963 5.00597 9.49963H2.51997C0.119971 9.49963 0.115304 13.4996 1.1793 13.4996H14.8C15.8346 13.4996 16.088 9.49963 12.9613 9.49963Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_8090_3518">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'bank/12': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="12" viewBox="0 0">
      <g id="16px/Bank">
        <path
          id="Vector"
          d="M2 14L2.50629 12.2277C2.52523 12.1614 2.56157 12.1038 2.61018 12.0629C2.65879 12.0221 2.7172 12.0001 2.77714 12H13.2229C13.2828 12.0001 13.3412 12.0221 13.3898 12.0629C13.4384 12.1038 13.4748 12.1614 13.4937 12.2277L14 13.9973"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M3.33325 6.66602H12.6666V11.9993H3.33325V6.66602Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path id="Vector_3" d="M14.6666 14H1.33325" strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector_4" d="M6 6.66602V11.9993" strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector_5" d="M10 6.66602V11.9993" strokeLinecap="round" strokeLinejoin="round" />
        <path
          id="Vector_6"
          d="M13.9852 5.10775C14.0063 5.04229 14.0048 4.9713 13.981 4.90684C13.9573 4.84237 13.9127 4.78842 13.8548 4.75415L8.14539 1.374C8.10154 1.34778 8.05179 1.33398 8.00115 1.33398C7.95052 1.33398 7.90077 1.34778 7.85692 1.374L2.14518 4.75176C2.08734 4.78603 2.04274 4.83998 2.01897 4.90445C1.9952 4.96891 1.99372 5.0399 2.01479 5.10536L2.45558 6.46304C2.4747 6.52248 2.5114 6.5742 2.56048 6.61086C2.60955 6.64752 2.66853 6.66727 2.72905 6.66732H13.2756C13.3361 6.66727 13.3951 6.64752 13.4441 6.61086C13.4932 6.5742 13.5299 6.52248 13.549 6.46304L13.9852 5.10775Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path id="Vector_7" d="M14 5H2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </SVG>
  ),
  'bank/16': (className: string) => (
    <SVG className={cn(className)} size="16" viewBox="0 0">
      <g id="16px/Bank">
        <path
          id="Vector"
          d="M2 14L2.50629 12.2277C2.52523 12.1614 2.56157 12.1038 2.61018 12.0629C2.65879 12.0221 2.7172 12.0001 2.77714 12H13.2229C13.2828 12.0001 13.3412 12.0221 13.3898 12.0629C13.4384 12.1038 13.4748 12.1614 13.4937 12.2277L14 13.9973"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M3.33325 6.66602H12.6666V11.9993H3.33325V6.66602Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path id="Vector_3" d="M14.6666 14H1.33325" strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector_4" d="M6 6.66602V11.9993" strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector_5" d="M10 6.66602V11.9993" strokeLinecap="round" strokeLinejoin="round" />
        <path
          id="Vector_6"
          d="M13.9852 5.10775C14.0063 5.04229 14.0048 4.9713 13.981 4.90684C13.9573 4.84237 13.9127 4.78842 13.8548 4.75415L8.14539 1.374C8.10154 1.34778 8.05179 1.33398 8.00115 1.33398C7.95052 1.33398 7.90077 1.34778 7.85692 1.374L2.14518 4.75176C2.08734 4.78603 2.04274 4.83998 2.01897 4.90445C1.9952 4.96891 1.99372 5.0399 2.01479 5.10536L2.45558 6.46304C2.4747 6.52248 2.5114 6.5742 2.56048 6.61086C2.60955 6.64752 2.66853 6.66727 2.72905 6.66732H13.2756C13.3361 6.66727 13.3951 6.64752 13.4441 6.61086C13.4932 6.5742 13.5299 6.52248 13.549 6.46304L13.9852 5.10775Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path id="Vector_7" d="M14 5H2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </SVG>
  ),
  'connected/16': (className: string) => (
    <SVG className={cn(className)} size="16" viewBox="0 0">
      <path
        d="M1.83333 9.30026C1.03333 8.70026 0.5 7.76693 0.5 6.70026C0.5 4.90026 1.96667 3.43359 3.76667 3.43359H8.96667C10.7667 3.43359 12.2333 4.90026 12.2333 6.70026C12.2333 8.50026 10.7667 9.96693 8.96667 9.96693H5.76667"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1667 6.69987C14.9667 7.29987 15.5 8.2332 15.5 9.29987C15.5 11.0999 14.0333 12.5665 12.2333 12.5665H7.03333C5.23333 12.5665 3.76666 11.0999 3.76666 9.29987C3.76666 7.49987 5.23333 6.0332 7.03333 6.0332H10.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'reload/16': (className: string) => (
    <SVG className={cn(className)} size="16">
      <path
        d="M12.2413 4.66639C11.5205 3.79333 10.5479 3.16398 9.45615 2.86423C8.3644 2.56449 7.20675 2.60897 6.14122 2.99159C5.07569 3.37421 4.15419 4.07633 3.50251 5.00212C2.85084 5.9279 2.50074 7.03224 2.5 8.16439V9.66639"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 11.9381C4.75586 12.739 5.73476 13.2946 6.80995 13.5329C7.88514 13.7711 9.00711 13.6812 10.0306 13.2746C11.0541 12.868 11.9319 12.1635 12.5505 11.2524C13.169 10.3412 13.4998 9.26534 13.5 8.16406V7.16406"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M0.5 7.66406L2.5 9.66406L4.5 7.66406" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M15.5 9.16406L13.5 7.16406L11.5 9.16406"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'missing/16': (className: string) => (
    <SVG className={cn(className)} size="16" viewBox="0 0">
      <g clipPath="url(#clip0_10834_63038)">
        <path
          d="M0.981347 8.90524C1.29169 9.63548 1.74282 10.2974 2.30899 10.8533C2.87516 11.4092 3.54528 11.8481 4.28108 12.1451C5.01688 12.442 5.80396 12.591 6.59737 12.5838C7.39079 12.5765 8.175 12.413 8.90524 12.1027C9.63547 11.7923 10.2974 11.3412 10.8533 10.775C11.4092 10.2089 11.8481 9.53876 12.145 8.80295C12.442 8.06715 12.591 7.28007 12.5838 6.48666C12.5765 5.69324 12.413 4.90903 12.1027 4.17879C11.7923 3.44855 11.3412 2.78659 10.775 2.2307C10.2089 1.67481 9.53874 1.23588 8.80294 0.938971C8.06713 0.64206 7.28006 0.492984 6.48664 0.500254C5.69323 0.507523 4.90901 0.670997 4.17878 0.98134C3.44854 1.29168 2.78658 1.74282 2.23069 2.30899C1.6748 2.87516 1.23587 3.54528 0.938965 4.28108C0.642056 5.01688 0.492982 5.80396 0.500254 6.59737C0.507526 7.39079 0.671001 8.175 0.981347 8.90524Z"
          stroke="#454D54"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10.814 10.8125L15.5 15.4992" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M4.5 4.99962C4.50007 4.63297 4.60093 4.2734 4.79155 3.9602C4.98217 3.647 5.2552 3.39223 5.58087 3.22372C5.90647 3.05522 6.2722 2.97947 6.63793 3.00477C7.00373 3.03005 7.35553 3.15541 7.65487 3.36712C7.9542 3.57883 8.1896 3.86876 8.33527 4.20521C8.481 4.54167 8.5314 4.9117 8.481 5.27487C8.4306 5.63803 8.2814 5.98039 8.0496 6.26446C7.8178 6.54853 7.51233 6.76339 7.16667 6.88559C6.9716 6.95459 6.80273 7.08233 6.68333 7.25126C6.56393 7.42026 6.49987 7.62206 6.5 7.82893V7.99959"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6.5 10C6.36193 10 6.25 9.88807 6.25 9.75C6.25 9.61193 6.36193 9.5 6.5 9.5" />
        <path d="M6.5 10C6.63807 10 6.75 9.88807 6.75 9.75C6.75 9.61193 6.63807 9.5 6.5 9.5" />
      </g>
      <defs>
        <clipPath id="clip0_10834_63038">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'error/16': (className: string) => (
    <SVG className={cn(className)} size="16" viewBox="0 0">
      <path d="M3 3L13 13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 3L3.00001 13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'delete/16': (className: string) => (
    <SVG className={cn(className)} size="16" viewBox="0 0">
      <path
        d="M12.5384 14.9232H4.46146C4.15544 14.9232 3.86196 14.8017 3.64557 14.5853C3.42918 14.3689 3.30762 14.0754 3.30762 13.7694V3.38477H13.6922V13.7694C13.6922 14.0754 13.5707 14.3689 13.3543 14.5853C13.1379 14.8017 12.8444 14.9232 12.5384 14.9232Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.76929 11.4611V6.8457" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2307 11.4611V6.8457" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 3.38477H16" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.2309 1.07617H6.76932C6.46331 1.07617 6.16982 1.19774 5.95343 1.41413C5.73704 1.63051 5.61548 1.924 5.61548 2.23002V3.38387H11.3847V2.23002C11.3847 1.924 11.2631 1.63051 11.0467 1.41413C10.8303 1.19774 10.5369 1.07617 10.2309 1.07617Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'column-edit/16': (className: string) => (
    <SVG className={cn(className)} size="16">
      <path
        d="M1.5 0.5H2.5C2.5 0.5 3.5 0.5 3.5 1.5V14.5C3.5 14.5 3.5 15.5 2.5 15.5H1.5C1.5 15.5 0.5 15.5 0.5 14.5V1.5C0.5 1.5 0.5 0.5 1.5 0.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 0.5H8.5C8.5 0.5 9.5 0.5 9.5 1.5V14.5C9.5 14.5 9.5 15.5 8.5 15.5H7.5C7.5 15.5 6.5 15.5 6.5 14.5V1.5C6.5 1.5 6.5 0.5 7.5 0.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 0.5H14.5C14.5 0.5 15.5 0.5 15.5 1.5V14.5C15.5 14.5 15.5 15.5 14.5 15.5H13.5C13.5 15.5 12.5 15.5 12.5 14.5V1.5C12.5 1.5 12.5 0.5 13.5 0.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'success-tick/12': (className: string) => (
    <SVG className={cn(className)} size="12">
      <path
        d="M1.5 6.31579L4.34211 9.15789L10.5 3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'tick-mark/12': (className: string) => (
    <SVG className={cn(className)} size="12">
      <path
        d="M13.3333 1.33335L4.66665 10L1 6.33335"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'copy-link/16': (className: string) => (
    <SVG className={cn(className)} size="16">
      <path
        d="M6.24269 12.3333L5.62135 12.9546C5.05874 13.5172 4.29567 13.8333 3.50002 13.8333C2.70436 13.8333 1.9413 13.5172 1.37869 12.9546C0.816073 12.392 0.5 11.6289 0.5 10.8333C0.5 10.0376 0.816073 9.27455 1.37869 8.71194L4.56069 5.52927C5.09417 4.99459 5.8097 4.68081 6.56441 4.6506C7.31911 4.62039 8.05744 4.87597 8.63195 5.3663C9.20647 5.85664 9.57488 6.54564 9.66362 7.29571C9.75237 8.04579 9.55491 8.80174 9.11069 9.41261"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.87855 3.71145L10.3786 3.21145C10.9412 2.64884 11.7042 2.33276 12.4999 2.33276C13.2955 2.33276 14.0586 2.64884 14.6212 3.21145C15.1838 3.77406 15.4999 4.53713 15.4999 5.33278C15.4999 6.12844 15.1838 6.8915 14.6212 7.45412L11.4392 10.6361C10.9056 11.1706 10.1901 11.4841 9.43546 11.5142C8.68083 11.5442 7.94263 11.2885 7.36826 10.7981C6.79389 10.3077 6.4256 9.61878 6.33692 8.86877C6.24825 8.11877 6.44571 7.36291 6.88988 6.75212"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'invited/12': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="12" viewBox="0 -0.5">
      <circle cx="6" cy="6" r="5" />
    </SVG>
  ),
  'invited/16': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="16" viewBox="0 -2.5">
      <circle cx="6" cy="6" r="6" />
    </SVG>
  ),
  'expired/12': (className: string) => (
    <SVG className={cn(className, 'fill-none stroke-current')} size="12" viewBox="0 -0.5">
      <path
        d="M1.32056 6C1.32056 7.39239 1.87368 8.72774 2.85825 9.71231C3.84281 10.6969 5.17817 11.25 6.57056 11.25C7.96294 11.25 9.2983 10.6969 10.2829 9.71231C11.2674 8.72774 11.8206 7.39239 11.8206 6C11.8206 4.60761 11.2674 3.27226 10.2829 2.28769C9.2983 1.30312 7.96294 0.75 6.57056 0.75C5.17817 0.75 3.84281 1.30312 2.85825 2.28769C1.87368 3.27226 1.32056 4.60761 1.32056 6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.57056 6V4.125" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.57056 6L8.91406 8.344" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'expired/16': (className: string) => (
    <SVG className={cn(className, 'fill-none stroke-current')} size="16" viewBox="0 -1">
      <path
        d="M1.32056 6C1.32056 7.39239 1.87368 8.72774 2.85825 9.71231C3.84281 10.6969 5.17817 11.25 6.57056 11.25C7.96294 11.25 9.2983 10.6969 10.2829 9.71231C11.2674 8.72774 11.8206 7.39239 11.8206 6C11.8206 4.60761 11.2674 3.27226 10.2829 2.28769C9.2983 1.30312 7.96294 0.75 6.57056 0.75C5.17817 0.75 3.84281 1.30312 2.85825 2.28769C1.87368 3.27226 1.32056 4.60761 1.32056 6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.57056 6V4.125" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.57056 6L8.91406 8.344" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'scheduled/12': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="12" viewBox="0 0">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.15378 1.0005C4.15378 0.867892 4.1011 0.740715 4.00733 0.646947C3.91356 0.553178 3.78639 0.5005 3.65378 0.5005C3.52117 0.5005 3.39399 0.553178 3.30022 0.646947C3.20646 0.740715 3.15378 0.867892 3.15378 1.0005V1.9415H2.37578C1.71428 1.9415 1.15378 2.5015 1.15378 3.1625V10.092C1.15378 10.7525 1.71428 11.313 2.37478 11.313H9.93278C10.5933 11.313 11.1538 10.7525 11.1538 10.092V3.1625C11.1538 2.5025 10.5933 1.942 9.93278 1.942H9.15378V1C9.15378 0.867392 9.1011 0.740215 9.00733 0.646447C8.91356 0.552678 8.78639 0.5 8.65378 0.5C8.52117 0.5 8.39399 0.552678 8.30022 0.646447C8.20646 0.740215 8.15378 0.867392 8.15378 1V1.942H4.15378V1.0005ZM2.15428 5.469H10.1538V10.092C10.1538 10.2 10.0413 10.313 9.93328 10.313H2.37528C2.26728 10.313 2.15428 10.2 2.15428 10.092V5.469Z"
      />
    </SVG>
  ),
  'scheduled/16': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="16" viewBox="0 -1">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.33337 0.667333C5.33337 0.490522 5.26314 0.320953 5.13811 0.195929C5.01309 0.0709046 4.84352 0.000666658 4.66671 0.000666658C4.4899 0.000666658 4.32033 0.0709046 4.1953 0.195929C4.07028 0.320953 4.00004 0.490522 4.00004 0.667333V1.922H2.96271C2.08071 1.922 1.33337 2.66867 1.33337 3.55V12.7893C1.33337 13.67 2.08071 14.4173 2.96137 14.4173H13.0387C13.9194 14.4173 14.6667 13.67 14.6667 12.7893V3.55C14.6667 2.67 13.9194 1.92267 13.0387 1.92267H12V0.666667C12 0.489856 11.9298 0.320286 11.8048 0.195262C11.6798 0.0702379 11.5102 0 11.3334 0C11.1566 0 10.987 0.0702379 10.862 0.195262C10.7369 0.320286 10.6667 0.489856 10.6667 0.666667V1.92267H5.33337V0.667333ZM2.66737 6.62533H13.3334V12.7893C13.3334 12.9333 13.1834 13.084 13.0394 13.084H2.96204C2.81804 13.084 2.66737 12.9333 2.66737 12.7893V6.62533Z"
      />
    </SVG>
  ),
  'calendar/16': (className: string) => (
    <SVG className={className} size="16">
      <g id="16px/Calendar">
        <path
          id="Vector"
          d="M14.5012 2.5H1.50122C0.948936 2.5 0.501221 2.94772 0.501221 3.5V14.5C0.501221 15.0523 0.948936 15.5 1.50122 15.5H14.5012C15.0535 15.5 15.5012 15.0523 15.5012 14.5V3.5C15.5012 2.94772 15.0535 2.5 14.5012 2.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M0.501221 6.5H15.5012"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path id="Vector_3" d="M4.50122 4V0.5" strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector_4" d="M11.5012 4V0.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </SVG>
  ),
  'info/16': (className: string) => (
    <SVG className={className} size="16">
      <g id="16px/Info" clipPath="url(#clip0_10157_54785)">
        <path
          id="Vector"
          d="M9.5 11H9C8.73478 11 8.48043 10.8946 8.29289 10.7071C8.10536 10.5196 8 10.2652 8 10V7.5C8 7.36739 7.94732 7.24022 7.85355 7.14645C7.75978 7.05268 7.63261 7 7.5 7H7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M7.75 5C7.6837 5 7.62011 4.97366 7.57322 4.92678C7.52634 4.87989 7.5 4.8163 7.5 4.75C7.5 4.6837 7.52634 4.62011 7.57322 4.57322C7.62011 4.52634 7.6837 4.5 7.75 4.5"
        />
        <path
          id="Vector_3"
          d="M7.75 5C7.8163 5 7.87989 4.97366 7.92678 4.92678C7.97366 4.87989 8 4.8163 8 4.75C8 4.6837 7.97366 4.62011 7.92678 4.57322C7.87989 4.52634 7.8163 4.5 7.75 4.5"
        />
        <path
          id="Vector_4"
          d="M8 15.5C12.142 15.5 15.5 12.142 15.5 8C15.5 3.858 12.142 0.5 8 0.5C3.858 0.5 0.5 3.858 0.5 8C0.5 12.142 3.858 15.5 8 15.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_10157_54785">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  ),
  'sort-down/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M6 11V1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 8L6 11L9 8" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'sort-up/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M6 1L6 11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4L6 1L3 4" strokeLinecap="round" strokeLinejoin="round" />
    </SVG>
  ),
  'failed-red/16': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="16">
      <circle cx="8" cy="8" r="8" fill="#F32448" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.20712 4.7929C5.8166 4.40237 5.18343 4.40236 4.7929 4.79288C4.40237 5.1834 4.40236 5.81657 4.79288 6.2071L6.58667 8.00093L4.7931 9.79455C4.40258 10.1851 4.40259 10.8182 4.79312 11.2088C5.18365 11.5993 5.81681 11.5993 6.20733 11.2087L8.00087 9.41517L9.7944 11.2087C10.1849 11.5993 10.8181 11.5993 11.2086 11.2088C11.5991 10.8182 11.5992 10.1851 11.2086 9.79455L9.41506 8.00093L11.2089 6.2071C11.5994 5.81657 11.5994 5.1834 11.2088 4.79288C10.8183 4.40236 10.1851 4.40237 9.79462 4.7929L8.00087 6.5867L6.20712 4.7929Z"
        fill="white"
      />
    </SVG>
  ),
  'created/16': (className: string) => (
    <SVG className={cn(className, 'fill-current stroke-none')} size="16">
      <circle cx="8" cy="8" r="8" fill="#454D54" />
      <circle cx="8.00008" cy="8.00008" r="3.33333" fill="white" />
    </SVG>
  ),
  'success/16': (className: string) => (
    <SVG className={cn(className, 'fill-none stroke-none')} size="16">
      <circle cx="8" cy="8" r="8" fill="#29A37A" />
      <path
        d="M4.25 8.26316L6.61842 10.6316L11.75 5.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'start/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M10 6L2.5 10.3301L2.5 1.66987L10 6Z" fill="#454D54" />
    </SVG>
  ),
  'authorise/12': (className: string) => (
    <SVG className={className} size="12">
      <path
        d="M9.30737 7.22736H7.98158C7.11668 7.22736 6.85757 6.63956 6.85757 5.96165C6.85757 4.83133 7.93846 4.14649 7.93846 3.02311C7.93846 2.48654 7.73346 1.97196 7.36856 1.59255C7.00365 1.21315 6.50873 1 5.99267 1C5.47661 1 4.98169 1.21315 4.61678 1.59255C4.25188 1.97196 4.04687 2.48654 4.04687 3.02311C4.04687 4.14649 5.12777 4.83133 5.12777 5.96165C5.12777 6.63956 4.86866 7.22736 4.00376 7.22736H2.34642C0.746401 7.22736 0.74329 10 1.45263 10H10.5332C11.2229 10 11.3918 7.22736 9.30737 7.22736Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  ),
  'checked/12': (className: string) => (
    <SVG className={className} size="12">
      <path d="M1 5.70588L4.2 9L11 2" strokeWidth="2" strokeLinecap="round" />
    </SVG>
  ),
} as const

export type IconNames = keyof typeof Icons

export interface IconProps extends VariantProps<typeof iconVariants> {
  className?: string
  name: IconNames
}

const Icon: React.FC<IconProps> = ({ className, name }) =>
  Icons[name](cn(iconVariants(), className))

Icon.displayName = 'Icon'

export { Icon }
