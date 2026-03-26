import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { apiClient } from '../utils/apiClient';
import { UserRepository } from '../repository/UserRepository';
import { UserTransformer } from '../transformers/UserTransformer';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

type GenderOption = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

const GENDER_OPTIONS: { label: string; value: GenderOption; icon: string }[] = [
    { label: 'Male', value: 'MALE', icon: '♂' },
    { label: 'Female', value: 'FEMALE', icon: '♀' },
    { label: 'Other', value: 'OTHER', icon: '⚧' },
    { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY', icon: '—' },
];

export default function ProfileSetupScreen({ route }: Props) {
    const { signIn } = useAuth();
    const { token, userId, phoneNo, emailId } = route.params;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState(emailId || '');
    const [phone, setPhone] = useState(phoneNo || '');
    const [gender, setGender] = useState<GenderOption | null>(null);
    const [birthDate, setBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // Set auth token so authenticated API calls work
        apiClient.setAuthToken(token);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim, token]);

    const validateForm = (): boolean => {
        if (!firstName.trim()) {
            setError('First name is required.');
            return false;
        }
        if (!lastName.trim()) {
            setError('Last name is required.');
            return false;
        }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
            setError('Enter a valid email address.');
            return false;
        }
        if (!phone.trim() || !/^[0-9]{10}$/.test(phone.trim())) {
            setError('Enter a valid 10-digit phone number.');
            return false;
        }
        if (!gender) {
            setError('Please select your gender.');
            return false;
        }
        if (!birthDate.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim())) {
            setError('Enter date of birth in YYYY-MM-DD format.');
            return false;
        }
        return true;
    };

    const handleComplete = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const numericUserId = Number(userId);

            // Update the user profile via PATCH endpoint with all collected data
            const updatedUser = await UserRepository.partialUpdateUser(numericUserId, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                emailId: email.trim().toLowerCase(),
                phoneNo: phone.trim(),
                gender: gender!,
                birthDate: birthDate.trim(),
            });

            // Transform the response and sign in
            const userProfile = UserTransformer.toUserProfile(updatedUser);

            signIn({
                token: token,
                user: userProfile,
                isNewUser: true,
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    // Step indicator - step 3 of 3
    const totalSteps = 3;
    const currentStep = 3;

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
                    <Animated.View style={{ opacity: fadeAnim }}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.appName}>Appointment Manager</Text>
                        </View>

                        {/* Step Indicator */}
                        <View style={styles.stepIndicator}>
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.stepDot,
                                        i + 1 <= currentStep && styles.stepDotActive,
                                        i + 1 < currentStep && styles.stepDotCompleted,
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Title */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Complete your profile</Text>
                            <Text style={styles.subtitle}>
                                Tell us a bit about yourself to get started
                            </Text>
                        </View>

                        {/* Form Card */}
                        <View style={styles.card}>
                            {/* Name Row */}
                            <View style={styles.row}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>First Name</Text>
                                    <TextInput
                                        value={firstName}
                                        onChangeText={(text) => {
                                            setFirstName(text);
                                            setError(null);
                                        }}
                                        placeholder="First"
                                        placeholderTextColor="#6b7280"
                                        style={styles.input}
                                        autoCapitalize="words"
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <TextInput
                                        value={lastName}
                                        onChangeText={(text) => {
                                            setLastName(text);
                                            setError(null);
                                        }}
                                        placeholder="Last"
                                        placeholderTextColor="#6b7280"
                                        style={styles.input}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            {/* Email (pre-filled & disabled if used for OTP) */}
                            <View>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setError(null);
                                    }}
                                    placeholder="name@example.com"
                                    placeholderTextColor="#6b7280"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!emailId}
                                    style={[styles.input, emailId ? styles.inputDisabled : {}]}
                                />
                                {emailId ? (
                                    <Text style={styles.verifiedBadge}>✓ Verified via OTP</Text>
                                ) : null}
                            </View>

                            {/* Phone (pre-filled & disabled if used for OTP) */}
                            <View>
                                <Text style={styles.label}>Phone Number</Text>
                                <View style={styles.phoneInputRow}>
                                    <View style={styles.countryCodeBox}>
                                        <Text style={styles.flagText}>🇮🇳</Text>
                                        <Text style={styles.countryCodeText}>+91</Text>
                                    </View>
                                    <TextInput
                                        value={phone}
                                        onChangeText={(text) => {
                                            setPhone(text);
                                            setError(null);
                                        }}
                                        placeholder="9876543210"
                                        placeholderTextColor="#6b7280"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        editable={!phoneNo}
                                        style={[
                                            styles.phoneInput,
                                            phoneNo ? styles.inputDisabled : {},
                                        ]}
                                    />
                                </View>
                                {phoneNo ? (
                                    <Text style={styles.verifiedBadge}>✓ Verified via OTP</Text>
                                ) : null}
                            </View>

                            {/* Date of Birth */}
                            <View>
                                <Text style={styles.label}>Date of Birth</Text>
                                <TextInput
                                    value={birthDate}
                                    onChangeText={(text) => {
                                        setBirthDate(text);
                                        setError(null);
                                    }}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor="#6b7280"
                                    keyboardType="numbers-and-punctuation"
                                    maxLength={10}
                                    style={styles.input}
                                />
                            </View>

                            {/* Gender */}
                            <View>
                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.genderGrid}>
                                    {GENDER_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={[
                                                styles.genderOption,
                                                gender === option.value && styles.genderOptionActive,
                                            ]}
                                            onPress={() => {
                                                setGender(option.value);
                                                setError(null);
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.genderIcon,
                                                gender === option.value && styles.genderIconActive,
                                            ]}>
                                                {option.icon}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.genderLabel,
                                                    gender === option.value && styles.genderLabelActive,
                                                ]}
                                            >
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Error */}
                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                                onPress={handleComplete}
                                disabled={loading}
                                activeOpacity={0.85}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Get Started</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
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
        paddingVertical: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 8,
    },
    appName: {
        color: '#f97316',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },
    stepDot: {
        width: 32,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#1f1f1f',
    },
    stepDotActive: {
        backgroundColor: '#f97316',
    },
    stepDotCompleted: {
        backgroundColor: '#4ade80',
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 24,
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
    },
    card: {
        backgroundColor: '#141414',
        borderRadius: 20,
        padding: 20,
        gap: 16,
        borderWidth: 1,
        borderColor: '#1f1f1f',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfField: {
        flex: 1,
    },
    label: {
        color: '#d1d5db',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#0d0d0d',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#f5f5f5',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#1f1f1f',
    },
    inputDisabled: {
        opacity: 0.5,
    },
    verifiedBadge: {
        color: '#4ade80',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        marginLeft: 4,
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
    genderGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    genderOption: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0d0d0d',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1.5,
        borderColor: '#1f1f1f',
        gap: 8,
    },
    genderOptionActive: {
        borderColor: '#f97316',
        backgroundColor: '#1a0f05',
    },
    genderIcon: {
        fontSize: 18,
        color: '#9ca3af',
    },
    genderIconActive: {
        color: '#f97316',
    },
    genderLabel: {
        color: '#9ca3af',
        fontSize: 13,
        fontWeight: '600',
    },
    genderLabelActive: {
        color: '#f5f5f5',
    },
    error: {
        color: '#f87171',
        fontSize: 13,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#f97316',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 4,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});
