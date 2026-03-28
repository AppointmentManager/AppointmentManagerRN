import React, { useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
} from 'react-native';
import {
    Button,
    Chip,
    HelperText,
    Surface,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    const theme = useTheme();
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

            const updatedUser = await UserRepository.partialUpdateUser(numericUserId, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                emailId: email.trim().toLowerCase(),
                phoneNo: phone.trim(),
                gender: gender!,
                birthDate: birthDate.trim(),
            });

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

    const totalSteps = 3;
    const currentStep = 3;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
                        {/* Header */}
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text
                                variant="labelMedium"
                                style={{
                                    color: theme.colors.secondary,
                                    letterSpacing: 1.5,
                                    fontWeight: '700',
                                }}
                            >
                                APPOINTMENT MANAGER
                            </Text>
                        </View>

                        {/* Step Indicator */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        width: 32,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: i + 1 < currentStep
                                            ? '#4ade80'
                                            : i + 1 <= currentStep
                                                ? theme.colors.secondary
                                                : theme.colors.surfaceVariant,
                                    }}
                                />
                            ))}
                        </View>

                        {/* Title */}
                        <View style={{ alignItems: 'center', marginBottom: 24, gap: 8 }}>
                            <Text variant="headlineMedium" style={{ fontWeight: '800', textAlign: 'center' }}>
                                Complete your profile
                            </Text>
                            <Text
                                variant="bodyMedium"
                                style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
                            >
                                Tell us a bit about yourself to get started
                            </Text>
                        </View>

                        {/* Form Card */}
                        <Surface
                            style={{
                                borderRadius: 20,
                                padding: 20,
                                gap: 16,
                                backgroundColor: theme.colors.surface,
                                borderWidth: 1,
                                borderColor: theme.colors.outline,
                            }}
                            elevation={0}
                        >
                            {/* Name Row */}
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        value={firstName}
                                        onChangeText={(text) => {
                                            setFirstName(text);
                                            setError(null);
                                        }}
                                        label="First Name"
                                        placeholder="First"
                                        mode="outlined"
                                        autoCapitalize="words"
                                        style={{ backgroundColor: theme.colors.background }}
                                        outlineStyle={{ borderRadius: 14, borderColor: theme.colors.outline }}
                                        textColor={theme.colors.onSurface}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        value={lastName}
                                        onChangeText={(text) => {
                                            setLastName(text);
                                            setError(null);
                                        }}
                                        label="Last Name"
                                        placeholder="Last"
                                        mode="outlined"
                                        autoCapitalize="words"
                                        style={{ backgroundColor: theme.colors.background }}
                                        outlineStyle={{ borderRadius: 14, borderColor: theme.colors.outline }}
                                        textColor={theme.colors.onSurface}
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View>
                                <TextInput
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setError(null);
                                    }}
                                    label="Email Address"
                                    placeholder="name@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    disabled={!!emailId}
                                    mode="outlined"
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        opacity: emailId ? 0.5 : 1,
                                    }}
                                    outlineStyle={{ borderRadius: 14, borderColor: theme.colors.outline }}
                                    textColor={theme.colors.onSurface}
                                />
                                {emailId ? (
                                    <Text
                                        variant="labelSmall"
                                        style={{ color: '#4ade80', marginTop: 4, marginLeft: 4 }}
                                    >
                                        ✓ Verified via OTP
                                    </Text>
                                ) : null}
                            </View>

                            {/* Phone */}
                            <View>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <Surface
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: theme.colors.background,
                                            borderRadius: 14,
                                            paddingHorizontal: 14,
                                            paddingVertical: 14,
                                            borderWidth: 1,
                                            borderColor: theme.colors.outline,
                                            gap: 6,
                                        }}
                                        elevation={0}
                                    >
                                        <Text style={{ fontSize: 18 }}>🇮🇳</Text>
                                        <Text variant="bodyLarge" style={{ fontWeight: '600' }}>+91</Text>
                                    </Surface>
                                    <TextInput
                                        value={phone}
                                        onChangeText={(text) => {
                                            setPhone(text);
                                            setError(null);
                                        }}
                                        label="Phone Number"
                                        placeholder="9876543210"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        disabled={!!phoneNo}
                                        mode="outlined"
                                        style={{
                                            flex: 1,
                                            backgroundColor: theme.colors.background,
                                            opacity: phoneNo ? 0.5 : 1,
                                        }}
                                        outlineStyle={{ borderRadius: 14, borderColor: theme.colors.outline }}
                                        textColor={theme.colors.onSurface}
                                    />
                                </View>
                                {phoneNo ? (
                                    <Text
                                        variant="labelSmall"
                                        style={{ color: '#4ade80', marginTop: 4, marginLeft: 4 }}
                                    >
                                        ✓ Verified via OTP
                                    </Text>
                                ) : null}
                            </View>

                            {/* Date of Birth */}
                            <TextInput
                                value={birthDate}
                                onChangeText={(text) => {
                                    setBirthDate(text);
                                    setError(null);
                                }}
                                label="Date of Birth"
                                placeholder="YYYY-MM-DD"
                                keyboardType="numbers-and-punctuation"
                                maxLength={10}
                                mode="outlined"
                                style={{ backgroundColor: theme.colors.background }}
                                outlineStyle={{ borderRadius: 14, borderColor: theme.colors.outline }}
                                textColor={theme.colors.onSurface}
                            />

                            {/* Gender */}
                            <View>
                                <Text
                                    variant="labelLarge"
                                    style={{ color: theme.colors.onSurface, marginBottom: 8 }}
                                >
                                    Gender
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    {GENDER_OPTIONS.map((option) => (
                                        <Chip
                                            key={option.value}
                                            selected={gender === option.value}
                                            onPress={() => {
                                                setGender(option.value);
                                                setError(null);
                                            }}
                                            mode="outlined"
                                            style={{
                                                backgroundColor: gender === option.value
                                                    ? theme.colors.secondaryContainer
                                                    : theme.colors.background,
                                                borderColor: gender === option.value
                                                    ? theme.colors.secondary
                                                    : theme.colors.outline,
                                                minWidth: '45%',
                                                flexGrow: 1,
                                            }}
                                            textStyle={{
                                                color: gender === option.value
                                                    ? theme.colors.onSurface
                                                    : theme.colors.onSurfaceVariant,
                                                fontWeight: '600',
                                            }}
                                        >
                                            {option.icon} {option.label}
                                        </Chip>
                                    ))}
                                </View>
                            </View>

                            {/* Error */}
                            {error ? (
                                <HelperText type="error" visible style={{ textAlign: 'center' }}>
                                    {error}
                                </HelperText>
                            ) : null}

                            {/* Submit Button */}
                            <Button
                                mode="contained"
                                onPress={handleComplete}
                                disabled={loading}
                                loading={loading}
                                contentStyle={{ paddingVertical: 8 }}
                                style={{ borderRadius: 16, marginTop: 4 }}
                                labelStyle={{ fontSize: 16, fontWeight: '700' }}
                                buttonColor={theme.colors.secondary}
                                textColor="#ffffff"
                            >
                                Get Started
                            </Button>
                        </Surface>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
