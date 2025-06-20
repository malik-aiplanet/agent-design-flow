import type { SVGProps } from "react";

export default function UploadFile(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.33331 13.3367V14.1667C3.33331 14.8297 3.59671 15.4656 4.06555 15.9344C4.53439 16.4033 5.17027 16.6667 5.83331 16.6667H14.1666C14.8297 16.6667 15.4656 16.4033 15.9344 15.9344C16.4033 15.4656 16.6666 14.8297 16.6666 14.1667V13.3333M9.99998 12.9167V3.75M9.99998 3.75L12.9166 6.66667M9.99998 3.75L7.08331 6.66667"
        stroke="black"
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
