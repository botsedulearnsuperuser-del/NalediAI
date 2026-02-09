import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

interface FeelingStuckIconProps {
    size?: number;
    color?: string;
}

export default function FeelingStuckIcon({ size = 24, color = '#666' }: FeelingStuckIconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5">
                <Path d="M2 12c0 5.523 4.477 10 10 10c1.821 0 3.53-.487 5-1.338M12 2c5.523 0 10 4.477 10 10c0 1.821-.487 3.53-1.338 5" />
                <Path strokeLinejoin="round" d="M12 9v4h4" />
                <Path strokeDasharray=".5 3.5" d="M17 20.662A9.96 9.96 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 1.821-.487 3.53-1.338 5" />
            </G>
        </Svg>
    );
}
