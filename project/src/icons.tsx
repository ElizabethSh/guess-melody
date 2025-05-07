import React from 'react';

export const closingCross = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="closing-cross">
    <g opacity="0.8">
      <path d="M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const circlePlus = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="circle-plus">
    <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#969696" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 4V8" stroke="#969696" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 6H8" stroke="#969696" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const user = (
  <svg
    width='1em'
    height='1em'
    viewBox='0 0 25 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='user'
  >
    <path
      d='M20.5 21V19C20.5 17.9391 20.0786 16.9217 19.3284 16.1716C18.5783 15.4214 17.5609 15 16.5 15H8.5C7.43913 15 6.42172 15.4214 5.67157 16.1716C4.92143 16.9217 4.5 17.9391 4.5 19V21'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12.5 11C14.7091 11 16.5 9.20914 16.5 7C16.5 4.79086 14.7091 3 12.5 3C10.2909 3 8.5 4.79086 8.5 7C8.5 9.20914 10.2909 11 12.5 11Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const circle = (
  <svg xmlns="http://www.w3.org/2000/svg" className="timer" viewBox="0 0 780 780">
    <circle className="timer__line" cx="390" cy="390" r="370"
      style={{ filter: 'url(#blur)', transform: 'rotate(-90deg) scaleY(-1)', transformOrigin: 'center' }}
    />
  </svg>
);

