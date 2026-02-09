import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

interface MedicalAssessmentIconProps {
    size?: number;
    color?: string;
}

export default function MedicalAssessmentIcon({ size = 20, color = '#FFF' }: MedicalAssessmentIconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <G fill="none" stroke={color} strokeLinecap="round" strokeWidth={1.5}>
                <Path strokeLinejoin="round" d="m9.5 12.4l1.429 1.6l3.571-4" />
                <Path d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 2.505-.837 4.437-2 5.913M3.193 14c.857 4.298 4.383 6.513 6.706 7.527c.721.315 1.082.473 2.101.473c1.02 0 1.38-.158 2.101-.473c.579-.252 1.231-.58 1.899-.994" />
            </G>
        </Svg>
    );
}
