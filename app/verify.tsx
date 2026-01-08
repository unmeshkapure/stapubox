import { Ionicons } from '@expo/vector-icons'; // For the back arrow
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../src/components/Skeleton'; // Assuming this can adapt or we pass colors
import { resendOtp, verifyOtp } from '../src/services/api';
import { Colors } from '../src/utils/colors';

// Try to import, handle if missing
let RNOtpVerify: any;
try {
    RNOtpVerify = require('react-native-otp-verify').default;
} catch (e) {
    console.log('react-native-otp-verify not available');
}

export default function VerifyOtpScreen() {
    const router = useRouter();
    const { mobile } = useLocalSearchParams<{ mobile: string }>();

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [hash, setHash] = useState<string[]>([]);

    const inputRef = useRef<TextInput>(null);

    // Timer logic
    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // SMS Retriever Logic
    useEffect(() => {
        if (Platform.OS === 'android' && RNOtpVerify) {
            RNOtpVerify.getHash()
                .then((h: string[]) => {
                    console.log('App Hash:', h);
                    setHash(h);
                })
                .catch(console.log);

            RNOtpVerify.getOtp()
                .then((p: boolean) => RNOtpVerify.addListener(otpHandler))
                .catch((p: any) => console.log(p));

            return () => {
                RNOtpVerify.removeListener();
            };
        }
    }, []);

    const otpHandler = (message: string) => {
        if (!message) return;
        const otpMatch = /(\d{4})/.exec(message);
        if (otpMatch && otpMatch[1]) {
            const extractedOtp = otpMatch[1];
            setOtp(extractedOtp);
            handleverifyOnly(extractedOtp);
            Keyboard.dismiss();
        }
    };

    const handleVerify = () => {
        handleverifyOnly(otp);
    };

    const handleverifyOnly = async (code: string) => {
        if (code.length !== 4) {
            setError('Please enter a valid 4-digit OTP.');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            await verifyOtp(mobile, code);
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.replace('/details');
            }, 1500);
        } catch (err: any) {
            setIsLoading(false);
            const msg = err.response?.data?.message || err.message || 'Verification failed.';
            setError(msg); // Will show "Incorrect OTP entered" or "No internet"
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setIsResending(true);
        setError(''); // Clear error immediately
        setOtp(''); // Auto-erase current OTP
        inputRef.current?.clear(); // Ensure TextInput is cleared

        try {
            await resendOtp(mobile);
            setTimer(60);
            Alert.alert('Sent', 'OTP has been resent to your mobile number.');
            if (Platform.OS === 'android' && RNOtpVerify) {
                RNOtpVerify.getOtp()
                    .then((p: boolean) => RNOtpVerify.addListener(otpHandler))
                    .catch((p: any) => console.log(p));
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to resend OTP.';
            setError(msg);
        } finally {
            setIsResending(false);
        }
    };

    // Auto-submit
    useEffect(() => {
        if (otp.length === 4) {
            handleverifyOnly(otp);
        }
    }, [otp]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.content}>

                {/* Header Back Button */}
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <View style={styles.backButtonCircle}>
                        <Ionicons name="chevron-back" size={24} color={Colors.text} />
                    </View>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Phone Verification</Text>

                <Text style={styles.title}>
                    Enter 4 digit OTP sent to your phone number {mobile}
                </Text>

                <TouchableOpacity onPress={() => router.back()} style={styles.changeLinkContainer}>
                    <Text style={styles.changeLinkText}>Change Number</Text>
                </TouchableOpacity>

                {isLoading && !isResending ? (
                    <View style={styles.skeletonContainer}>
                        {/* Custom skeleton color for dark mode */}
                        <Skeleton width={300} height={60} style={{ backgroundColor: Colors.skeleton }} />
                    </View>
                ) : isSuccess ? (
                    <View style={styles.successContainer}>
                        <View style={styles.successIconCircle}>
                            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
                        </View>
                        <Text style={styles.successText}>Verified Successfully</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.otpContainer}>
                            {/* Visual Boxes */}
                            <View style={styles.otpBoxesContainer}>
                                {[0, 1, 2, 3].map((index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.otpBox,
                                            otp.length === index && styles.otpBoxActive,
                                            otp.length > index && styles.otpBoxFilled,
                                            !!error && styles.otpBoxError,
                                        ]}
                                    >
                                        <Text style={styles.otpText}>
                                            {otp[index] || ''}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Invisible Interactive Input Overlay */}
                            <TextInput
                                ref={inputRef}
                                style={styles.overlayInput}
                                keyboardType="number-pad"
                                maxLength={4}
                                value={otp}
                                onChangeText={(text) => {
                                    setOtp(text.replace(/[^0-9]/g, ''));
                                    if (error) setError('');
                                }}
                                autoFocus={true}
                                caretHidden={true}
                                contextMenuHidden={true}
                            />
                        </View>

                        {/* Error Text exactly below boxes */}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        {/* Resend Link aligned left */}
                        <View style={styles.resendContainer}>
                            {isResending ? (
                                <ActivityIndicator size="small" color={Colors.primary} />
                            ) : (
                                <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                                    <Text style={[styles.resendLink, timer > 0 && styles.resendDisabled]}>
                                        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>



                        {/* Hidden Verify Button (auto-submit is primary), 
                            but keeping a Touchable area just in case user taps? 
                            Nah, design has no button. We trust auto-submit.
                        */}

                    </>
                )}
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 24,
        flex: 1,
    },
    backButton: {
        marginBottom: 24,
        // Align left
        alignSelf: 'flex-start',
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1C1C1E', // Slightly lighter than black
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        position: 'absolute',
        width: '100%',
        top: 34, // Align roughly with back button
        left: 24, // Offset padding
        zIndex: -1, // Behind back button
        // Or we can structure strictly.
        // For now, let's just make it a simple sub-header if design implies.
        // Actually Design screen 3 has "Phone Verification" at top center or left next to back? 
        // Image checks: It's " < Phone Verification". Next to it.
        // Let's adjust:
    },
    // Redoing header to match " < Phone Verification" row:
    // Actually in Screen 3, it looks like:
    // [ < ] Header Title

    title: {
        fontSize: 24, // Large and clean
        fontWeight: '400',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 40,
        lineHeight: 32,
    },
    skeletonContainer: {
        alignItems: 'center',
    },
    otpContainer: {
        marginBottom: 16, // Space before error/resend
        alignItems: 'center', // Center the boxes horizontally
    },
    overlayInput: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.01, // Invisible but receives touches
        zIndex: 10,  // On top of boxes
    },
    otpBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Spread them out
        width: '100%',
        // Adjust gap if needed via maxWidth
    },
    otpBox: {
        width: 64,  // Square
        height: 64, // Square
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3A3A3C', // Dark grey border
        backgroundColor: Colors.inputBackground, // Dark grey fill
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpBoxActive: {
        borderColor: '#FEFEFE', // White Highlight when active
        borderWidth: 1,
        // No background change, or maybe slight
    },
    otpBoxFilled: {
        borderColor: '#3A3A3C', // Revert to normal or stay white? Design looks white border for filled? 
        // Let's keep it subtle until filled.
        borderColor: '#FFFFFF',
    },
    otpBoxError: {
        borderColor: Colors.error,
        borderWidth: 1,
    },
    otpText: {
        fontSize: 24,
        fontWeight: '500',
        color: Colors.text,
    },
    errorText: {
        color: Colors.error, // Red
        fontSize: 12,
        marginTop: 8,
        marginBottom: 8,
        alignSelf: 'flex-start', // Left aligned
        marginLeft: 4,
        fontWeight: '500',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Left aligned
        marginTop: 0,
        marginLeft: 4,
    },
    resendLink: {
        color: Colors.primary, // Blue
        fontWeight: '500',
        fontSize: 14,
    },
    resendDisabled: {
        color: Colors.textSecondary,
    },
    successContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    successIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successText: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: '600',
    },
    changeLinkContainer: {
        marginBottom: 24,
        alignSelf: 'flex-start',
    },
    changeLinkText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    debugButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FFFFFF', // High contrast white
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    debugButtonText: {
        color: '#000000', // Black text
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
});
