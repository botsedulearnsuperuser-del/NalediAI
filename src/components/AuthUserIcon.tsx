import React from 'react';
import Svg, { G, Circle, Path } from 'react-native-svg';

interface AuthUserIconProps {
    size?: number;
    color?: string;
}

export default function AuthUserIcon({ size = 20, color = '#666' }: AuthUserIconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <G fill="none" stroke={color} strokeWidth="1.5">
                <Circle cx="12" cy="9" r="3" />
                <Path strokeLinecap="round" d="M17.97 20c-.16-2.892-1.045-5-5.97-5s-5.81 2.108-5.97 5" />
                <Path
                    strokeLinecap="round"
                    d="M7 3.338A9.95 9.95 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"
                />
            </G>
        </Svg>
    );
}
