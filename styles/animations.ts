import { keyframes } from '@mantine/core';

export const hueRotate = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(90deg);
  }
  to {
    filter: hue-rotate(0deg);
  }
`;
