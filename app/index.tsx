import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendOtp } from '../src/services/api';
import { Colors } from '../src/utils/colors';
import { isValidIndianMobileNumber } from '../src/utils/validation';

const COUNTRIES = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
];

export default function SendOtpScreen() {
    const router = useRouter();
    const [mobile, setMobile] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Derived state for button: Ensure 10 digits
    const isButtonActive = mobile.length === 10;

    const handleSendOtp = async () => {
        // Enforce 10-digit validation check (User Request)
        if (mobile.length !== 10) {
            Alert.alert('Invalid Number', 'Number should be of 10 digits');
            return;
        }

        // Basic validation - adjusted for dynamic country if needed, 
        // strictly checking Indian number if +91, else generic len check
        if (countryCode === '+91' && !isValidIndianMobileNumber(mobile)) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit Indian mobile number.');
            return;
        }

        setIsLoading(true);
        try {
            await sendOtp(mobile);
            setIsLoading(false);
            // Passing full number implicitly by context or explicitly if param needed
            // The verify screen shows "sent to {mobile}", so we might want to pass formatted
            router.push({ pathname: '/verify', params: { mobile } });
        } catch (err: any) {
            setIsLoading(false);
            const msg = err.response?.data?.message || err.message || 'Something went wrong.';
            Alert.alert('Error', msg);
        }
    };

    const renderCountryItem = ({ item }: { item: typeof COUNTRIES[0] }) => (
        <TouchableOpacity
            style={styles.countryItem}
            onPress={() => {
                setCountryCode(item.code);
                setShowCountryPicker(false);
            }}
        >
            <Text style={styles.countryFlag}>{item.flag}</Text>
            <Text style={styles.countryName}>{item.name}</Text>
            <Text style={styles.countryCodeItem}>{item.code}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.content}>

                    <Text style={styles.title}>Login to Your Account</Text>

                    <View style={styles.inputRow}>
                        {/* Country Code Dropdown */}
                        <TouchableOpacity
                            style={styles.countryCodeContainer}
                            onPress={() => setShowCountryPicker(true)}
                        >
                            <Text style={styles.countryCodeText}>{countryCode}</Text>
                            <Text style={styles.dropdownIcon}>▼</Text>
                        </TouchableOpacity>

                        {/* Phone Input */}
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="Enter Mobile Number"
                            placeholderTextColor={Colors.textSecondary}
                            keyboardType="number-pad"
                            maxLength={10}
                            value={mobile}
                            onChangeText={setMobile}
                            selectionColor={Colors.primary}
                        />
                    </View>

                    {/* Send OTP Button */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isButtonActive ? styles.buttonActive : styles.buttonDisabled
                        ]}
                        onPress={handleSendOtp}
                        disabled={!isButtonActive || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Send OTP</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer Links */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Don't have account? </Text>
                        <TouchableOpacity>
                            <Text style={styles.createAccountLink}>Create Account</Text>
                        </TouchableOpacity>
                    </View>

                </Animated.View>

                {/* Country Picker Modal */}
                <Modal
                    visible={showCountryPicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowCountryPicker(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Country</Text>
                                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={COUNTRIES}
                                renderItem={renderCountryItem}
                                keyExtractor={(item) => item.code}
                            />
                        </View>
                    </View>
                </Modal>

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
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: Colors.text, // White
        marginBottom: 32,
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginLeft: 4,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1C1C1E', // Dark grey
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 56,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        minWidth: 80,
    },
    countryCodeText: {
        color: Colors.text,
        fontSize: 16,
        marginRight: 4,
    },
    dropdownIcon: {
        color: Colors.textSecondary,
        fontSize: 10,
    },
    phoneInput: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        borderRadius: 8,
        paddingHorizontal: 16,
        color: Colors.text,
        fontSize: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#3A3A3C',
    },
    button: {
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonActive: {
        backgroundColor: Colors.primary, // Blue
    },
    buttonDisabled: {
        backgroundColor: '#1C1C1E',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    createAccountLink: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    closeButton: {
        color: Colors.primary,
        fontSize: 16,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3C',
    },
    countryFlag: {
        fontSize: 24,
        marginRight: 12,
    },
    countryName: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    countryCodeItem: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
});
