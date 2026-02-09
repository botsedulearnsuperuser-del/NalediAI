import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface OpenExercisesIconProps {
    size?: number;
    color?: string;
}

export default function OpenExercisesIcon({ size = 24, color = '#000' }: OpenExercisesIconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M12 7v10m5-7v4M7 9v6M7 3.338A9.95 9.95 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"
            />
        </Svg>
    );
}
