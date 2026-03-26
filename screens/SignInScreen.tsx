import React, { useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const isPhone = (value: string) => /^[0-9]{10}$/.test(value);

export default function SignInScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { signIn } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [inputMode, setInputMode] = useState<'phone' | 'email'>('phone');

    const otpRefs = useRef<(TextInput | null)[]>([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const trimmedIdentifier = useMemo(() => identifier.trim(), [identifier]);

    const buildPayload = () => {
        if (inputMode === 'email') {
            return { emailId: trimmedIdentifier.toLowerCase() };
        }
        return { phoneNo: trimmedIdentifier };
    };

    const validateIdentifier = () => {
        if (inputMode === 'email' && !isEmail(trimmedIdentifier)) {
            setError('Enter a valid email address.');
            return false;
        }
        if (inputMode === 'phone' && !isPhone(trimmedIdentifier)) {
            setError('Enter a valid 10-digit phone number.');
            return false;
        }
        return true;
    };

    const animateOtpIn = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleSendOtp = async () => {
        if (!validateIdentifier()) {
            return;
        }
        setLoading(true);
        setError(null);
        const response = await AuthService.sendOtp(buildPayload());

        if (response.success && response.data) {
            setOtpSent(true);
            setMessage(response.data.message || 'OTP sent successfully.');
            animateOtpIn();
            setTimeout(() => otpRefs.current[0]?.focus(), 500);
        } else {
            setMessage(null);
            setError(response.error || 'Unable to send OTP right now.');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Enter the 6-digit OTP.');
            return;
        }
        setLoading(true);
        setError(null);
        const response = await AuthService.verifyOtp({
            ...buildPayload(),
            otp: otpString,
        });

        if (response.success && response.data) {
            signIn(response.data);
        } else {
            setError(response.error || 'OTP verification failed.');
        }
        setLoading(false);
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setError(null);
        const response = await AuthService.resendOtp(buildPayload());
        setMessage(response.success ? response.message || 'OTP resent.' : null);
        setError(response.success ? null : response.error || 'Unable to resend OTP.');
        setLoading(false);
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleBack = () => {
        setOtpSent(false);
        setOtp(['', '', '', '', '', '']);
        setMessage(null);
        setError(null);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.appName}>Appointment Manager</Text>
                    </View>

                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>
                            {otpSent ? 'Verify OTP' : 'Log in or sign up'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {otpSent
                                ? `We've sent a 6-digit code to your ${inputMode === 'email' ? 'email' : 'phone number'}`
                                : 'Enter your phone number or email to continue'}
                        </Text>
                    </View>

                    {/* Input Card */}
                    <View style={styles.card}>
                        {!otpSent ? (
                            <>
                                {/* Mode Toggle */}
                                <View style={styles.modeToggle}>
                                    <TouchableOpacity
                                        style={[
                                            styles.modeButton,
                                            inputMode === 'phone' && styles.modeButtonActive,
                                        ]}
                                        onPress={() => {
                                            setInputMode('phone');
                                            setIdentifier('');
                                            setError(null);
                                        }}
                                    >
                                        <Text style={[
                                            styles.modeButtonText,
                                            inputMode === 'phone' && styles.modeButtonTextActive,
                                        ]}>
                                            📱 Phone
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.modeButton,
                                            inputMode === 'email' && styles.modeButtonActive,
                                        ]}
                                        onPress={() => {
                                            setInputMode('email');
                                            setIdentifier('');
                                            setError(null);
                                        }}
                                    >
                                        <Text style={[
                                            styles.modeButtonText,
                                            inputMode === 'email' && styles.modeButtonTextActive,
                                        ]}>
                                            ✉️ Email
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Phone Input */}
                                {inputMode === 'phone' ? (
                                    <View style={styles.phoneInputRow}>
                                        <View style={styles.countryCodeBox}>
                                            <Text style={styles.flagText}>🇮🇳</Text>
                                            <Text style={styles.countryCodeText}>+91</Text>
                                        </View>
                                        <TextInput
                                            value={identifier}
                                            onChangeText={setIdentifier}
                                            placeholder="Enter Phone Number"
                                            placeholderTextColor="#6b7280"
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                            style={styles.phoneInput}
                                        />
                                    </View>
                                ) : (
                                    <TextInput
                                        value={identifier}
                                        onChangeText={setIdentifier}
                                        placeholder="Enter Email Address"
                                        placeholderTextColor="#6b7280"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={styles.emailInput}
                                    />
                                )}
                            </>
                        ) : (
                            <Animated.View
                                style={[
                                    styles.otpSection,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }],
                                    },
                                ]}
                            >
                                {/* Back button */}
                                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                                    <Text style={styles.backButtonText}>← Change {inputMode === 'email' ? 'email' : 'number'}</Text>
                                </TouchableOpacity>

                                <Text style={styles.otpSentTo}>
                                    {inputMode === 'email'
                                        ? trimmedIdentifier.toLowerCase()
                                        : `+91 ${trimmedIdentifier}`}
                                </Text>

                                {/* OTP Input Boxes */}
                                <View style={styles.otpRow}>
                                    {otp.map((digit, index) => (
                                        <TextInput
                                            key={index}
                                            ref={(ref) => { otpRefs.current[index] = ref; }}
                                            value={digit}
                                            onChangeText={(text) => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
                                            onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            style={[
                                                styles.otpBox,
                                                digit ? styles.otpBoxFilled : {},
                                            ]}
                                            selectionColor="#ef4444"
                                        />
                                    ))}
                                </View>

                                {/* Resend */}
                                <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                                    <Text style={styles.resendText}>
                                        Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {/* Messages */}
                        {message ? <Text style={styles.message}>{message}</Text> : null}
                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        {/* Continue / Verify Button */}
                        <TouchableOpacity
                            style={[styles.continueButton, loading && styles.continueButtonDisabled]}
                            onPress={otpSent ? handleVerifyOtp : handleSendOtp}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.continueButtonText}>
                                    {otpSent ? 'Verify & Continue' : 'Continue'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.footerLinkText}>
                                Don't have an account?{' '}
                                <Text style={styles.footerLinkHighlight}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 8,
    },
    appName: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 32,
        gap: 8,
    },
    title: {
        color: '#f5f5f5',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 280,
    },
    card: {
        backgroundColor: '#141414',
        borderRadius: 20,
        padding: 20,
        gap: 16,
        borderWidth: 1,
        borderColor: '#1f1f1f',
    },
    modeToggle: {
        flexDirection: 'row',
        backgroundColor: '#0a0a0a',
        borderRadius: 14,
        padding: 4,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    modeButtonActive: {
        backgroundColor: '#1f1f1f',
    },
    modeButtonText: {
        color: '#6b7280',
        fontSize: 14,
        fontWeight: '600',
    },
    modeButtonTextActive: {
        color: '#f5f5f5',
    },
    phoneInputRow: {
        flexDirection: 'row',
        gap: 10,
    },
    countryCodeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0d0d0d',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#1f1f1f',
        gap: 6,
    },
    flagText: {
        fontSize: 18,
    },
    countryCodeText: {
        color: '#d1d5db',
        fontSize: 15,
        fontWeight: '600',
    },
    phoneInput: {
        flex: 1,
        backgroundColor: '#0d0d0d',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#f5f5f5',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#1f1f1f',
        letterSpacing: 1,
    },
    emailInput: {
        backgroundColor: '#0d0d0d',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#f5f5f5',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#1f1f1f',
    },
    otpSection: {
        gap: 16,
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#9ca3af',
        fontSize: 13,
        fontWeight: '500',
    },
    otpSentTo: {
        color: '#d1d5db',
        fontSize: 14,
        fontWeight: '500',
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    otpBox: {
        width: 46,
        height: 54,
        backgroundColor: '#0d0d0d',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#1f1f1f',
        textAlign: 'center',
        color: '#f5f5f5',
        fontSize: 20,
        fontWeight: '700',
    },
    otpBoxFilled: {
        borderColor: '#ef4444',
        backgroundColor: '#1a0a0a',
    },
    resendText: {
        color: '#6b7280',
        fontSize: 13,
    },
    resendLink: {
        color: '#ef4444',
        fontWeight: '600',
    },
    message: {
        color: '#4ade80',
        fontSize: 13,
        textAlign: 'center',
    },
    error: {
        color: '#f87171',
        fontSize: 13,
        textAlign: 'center',
    },
    continueButton: {
        backgroundColor: '#ef4444',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    continueButtonDisabled: {
        opacity: 0.7,
    },
    continueButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        marginTop: 28,
        alignItems: 'center',
        gap: 20,
        paddingBottom: 24,
    },
    footerLinkText: {
        color: '#9ca3af',
        fontSize: 14,
    },
    footerLinkHighlight: {
        color: '#ef4444',
        fontWeight: '700',
    },
    termsRow: {
        alignItems: 'center',
        gap: 4,
    },
    termsText: {
        color: '#6b7280',
        fontSize: 12,
    },
    termsLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    termsLink: {
        color: '#9ca3af',
        fontSize: 12,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    termsDot: {
        color: '#6b7280',
        fontSize: 12,
    },
});
