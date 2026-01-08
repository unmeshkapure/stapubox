import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleSheet } from 'react-native';

interface SkeletonProps {
    width: DimensionValue;
    height: number;
    style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, opacity },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
    },
});
