
import React from 'react';

// Fix: Converted LEAF_SVG from JSX to React.createElement to be compatible with a .ts file.
// JSX syntax is not allowed in .ts files and causes parsing errors.
export const LEAF_SVG = React.createElement(
  'svg',
  {
    className: 'h-8 w-auto inline-block mr-2',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  },
  React.createElement('path', {
    d:
      'M12.872 3.033A1.5 1.5 0 0011.128 3.033L5.61 14.128A1.5 1.5 0 006.82 16.5H17.18a1.5 1.5 0 001.21-2.372L12.872 3.033z',
    fill: '#10B981',
    transform: 'rotate(15 12 12)',
  }),
  React.createElement('path', {
    d: 'M18.5 15.5c-3.5 0-6 4-6 4s2.5 4 6 4 6-4 6-4-2.5-4-6-4z',
    fill: '#059669',
  }),
);
