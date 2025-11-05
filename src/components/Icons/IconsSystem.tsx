import React from 'react';

export interface IconsSystemProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

export const SvgArrowRight: React.FC<IconsSystemProps> = ({
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 1.5,
  className = 'size-6',
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    strokeWidth={strokeWidth}
    stroke={stroke}
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
);

export const SvgArrowLeft: React.FC<IconsSystemProps> = ({
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 1.5,
  className = 'size-6',
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    strokeWidth={strokeWidth}
    stroke={stroke}
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m15.75 19.5-7.5-7.5 7.5-7.5"
    />
  </svg>
);

export const SvgAicon: React.FC<IconsSystemProps> = ({
  width = 24,
  height = 24,

  className = 'size-6',
  ...rest
}) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M3.375 19V14.5M3.375 5.5V1M1 3.25H5.75M1 16.75H5.75M11.45 1.9L9.80253 5.95798C9.53462 6.61788 9.40066 6.94784 9.19235 7.22538C9.00773 7.47136 8.78088 7.68627 8.52123 7.86118C8.22827 8.05852 7.87999 8.18543 7.18342 8.43924L2.9 10L7.18342 11.5608C7.87999 11.8146 8.22827 11.9415 8.52123 12.1388C8.78088 12.3137 9.00773 12.5286 9.19235 12.7746C9.40066 13.0522 9.53462 13.3821 9.80253 14.042L11.45 18.1L13.0975 14.042C13.3654 13.3821 13.4993 13.0522 13.7076 12.7746C13.8923 12.5286 14.1191 12.3137 14.3788 12.1388C14.6717 11.9415 15.02 11.8146 15.7166 11.5608L20 10L15.7166 8.43924C15.02 8.18543 14.6717 8.05852 14.3788 7.86118C14.1191 7.68627 13.8923 7.47136 13.7076 7.22538C13.4993 6.94784 13.3654 6.61788 13.0975 5.95798L11.45 1.9Z"
      stroke="url(#paint0_linear_95_130)"
      stroke-opacity="0.8"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_95_130"
        x1="10.5"
        y1="1"
        x2="10.5"
        y2="19"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.475962" stop-color="white" />
      </linearGradient>
    </defs>
  </svg>
);

export const SvgSquare: React.FC<IconsSystemProps> = ({
  width = 38,
  height = 38,
  fill = 'currentColor',
  className = 'size-6',
  ...rest
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <path d="M0 38H38V0H0V38Z" fill={fill} />
  </svg>
);
