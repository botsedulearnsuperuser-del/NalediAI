import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

interface ReframingLoaderProps {
    size?: number;
    color?: string;
}

export const ReframingLoader: React.FC<ReframingLoaderProps> = ({ size = 60, color = '#FFFFFF' }) => {
    const scale = size / 24;

    const useRectAnim = (delay: number) => {
        const value = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            const startAnimation = () => {
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(value, {
                                toValue: 1,
                                duration: 600,
                                easing: Easing.linear,
                                useNativeDriver: false,
                            }),
                            Animated.timing(value, {
                                toValue: 0,
                                duration: 0,
                                useNativeDriver: false,
                            }),
                            Animated.delay(600)
                        ])
                    )
                ]).start();
            };

            startAnimation();
        }, [delay]); // dependent on delay actually

        return value;
    };

    const r1 = useRectAnim(0);
    const r2 = useRectAnim(150);
    const r3 = useRectAnim(300);
    const r4 = useRectAnim(450);

    const getStyle = (animValue: Animated.Value, baseX: number, baseY: number) => {
        const move = animValue.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [0, -1 * scale, 0]
        });

        const grow = animValue.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [9 * scale, 11 * scale, 9 * scale]
        });

        return {
            position: 'absolute' as 'absolute',
            left: Animated.add(baseX * scale, move),
            top: Animated.add(baseY * scale, move),
            width: grow,
            height: grow,
            backgroundColor: color,
            borderRadius: 1 * scale,
        };
    };

    return (
        <View style={{ width: size, height: size }}>
            <Animated.View style={getStyle(r1, 1.5, 1.5)} />
            <Animated.View style={getStyle(r2, 13.5, 1.5)} />
            <Animated.View style={getStyle(r3, 13.5, 13.5)} />
            <Animated.View style={getStyle(r4, 1.5, 13.5)} />
        </View>
    );
};
