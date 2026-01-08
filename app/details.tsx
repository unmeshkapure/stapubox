import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/utils/colors';

export default function UserDetailsScreen() {
    const router = useRouter();

    // ... (state remains same)

    const handleNext = () => {
        // ...
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <Animated.View entering={FadeInDown.duration(600).delay(200)} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        <Text style={styles.headerTitle}>Enter your details</Text>

                        {/* Form Groups ... */}

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Name*</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Type your name"
                                placeholderTextColor={Colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Address*</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Address Line 1"
                                placeholderTextColor={Colors.textSecondary}
                                value={address1}
                                onChangeText={setAddress1}
                            />
                            <TextInput
                                style={[styles.input, styles.inputMarginTop]}
                                placeholder="Address Line 2 (Optional)"
                                placeholderTextColor={Colors.textSecondary}
                                value={address2}
                                onChangeText={setAddress2}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Pin Code*</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 110001"
                                placeholderTextColor={Colors.textSecondary}
                                keyboardType="number-pad"
                                maxLength={6}
                                value={pinCode}
                                onChangeText={setPinCode}
                            />
                        </View>

                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, isFormValid ? styles.buttonActive : styles.buttonDisabled]}
                            onPress={handleNext}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background, // Black
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollContent: {
        padding: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 40,
        marginTop: 10,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#1C1C1E', // Dark grey
        borderWidth: 1,
        borderColor: '#3A3A3C',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 16, // Tall inputs
        color: Colors.text,
        fontSize: 16,
    },
    inputMarginTop: {
        marginTop: 16,
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 0 : 24,
    },
    button: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonActive: {
        backgroundColor: Colors.primary, // Blue
    },
    buttonDisabled: {
        backgroundColor: '#2C2C2E', // Darker Grey
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
