import React from 'react';
import Svg, { G, Path, Circle } from 'react-native-svg';

interface LearnQuestionIconProps {
    size?: number;
    color?: string;
}

export default function LearnQuestionIcon({ size = 32, color = '#004b2c' }: LearnQuestionIconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <G fill="none">
                <Path
                    stroke={color}
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M10.125 8.875a1.875 1.875 0 1 1 2.828 1.615c-.475.281-.953.708-.953 1.26V13"
                />
                <Circle cx="12" cy="16" r="1" fill={color} />
                <Path
                    stroke={color}
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M7 3.338A9.95 9.95 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"
                />
            </G>
        </Svg>
    );
}
