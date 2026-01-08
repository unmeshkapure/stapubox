import React, { useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, withRepeat } from 'react-native-reanimated';
import { Colors } from '../utils/colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    style,
    ...props
}) => {
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: rotation.value }],
        };
    });

    useEffect(() => {
        if (error) {
            rotation.value = withSequence(
                withTiming(-10, { duration: 50 }),
                withRepeat(withTiming(10, { duration: 100 }), 4, true),
                withTiming(0, { duration: 50 })
            );
        }
    }, [error]);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Animated.View style={animatedStyle}>
                <TextInput
                    style={[
                        styles.input,
                        error ? styles.inputError : null,
                        style,
                    ]}
                    placeholderTextColor={Colors.textSecondary}
                    {...props}
                />
            </Animated.View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.inputBackground,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.text,
    },
    inputError: {
        borderColor: Colors.error,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
