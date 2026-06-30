import React from 'react';

// DayFlow Logo — rounded checkbox with checkmark, black & white (matching Stitch design)
const DayFlowLogo = ({ size = 32, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Rounded square border */}
        <rect
            x="5" y="5" width="90" height="90"
            rx="22" ry="22"
            stroke="#000000"
            strokeWidth="9"
            fill="white"
        />
        {/* Checkmark */}
        <polyline
            points="27,52 43,68 73,33"
            stroke="#000000"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

export default DayFlowLogo;
