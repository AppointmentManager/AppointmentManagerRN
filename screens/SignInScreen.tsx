import React, {useMemo, useRef, useState} from 'react';
import {Animated, KeyboardAvoidingView, Platform, View} from 'react-native';
import {
  Button,
  HelperText,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../contexts/AuthContext';
import {AuthService} from '../services/authService';
import {RootStackParamList} from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const isPhone = (value: string) => /^[0-9]{10}$/.test(value);

export default function SignInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const {signIn} = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'phone' | 'email'>('phone');

  const otpRefs = useRef<Array<React.ElementRef<typeof TextInput> | null>>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const trimmedIdentifier = useMemo(() => identifier.trim(), [identifier]);

  const buildPayload = () => {
    if (inputMode === 'email') {
      return {emailId: trimmedIdentifier.toLowerCase()};
    }
    return {phoneNo: trimmedIdentifier};
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
    setError(
      response.success ? null : response.error || 'Unable to resend OTP.',
    );
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
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'center',
          }}>
          {/* Header */}
          <View style={{alignItems: 'center', marginBottom: 8}}>
            <Text
              variant="labelMedium"
              style={{
                color: theme.colors.primary,
                letterSpacing: 1.5,
                fontWeight: '700',
              }}>
              APPOINTMENT MANAGER
            </Text>
          </View>

          {/* Title Section */}
          <View style={{alignItems: 'center', marginBottom: 32, gap: 8}}>
            <Text
              variant="headlineMedium"
              style={{fontWeight: '800', textAlign: 'center'}}>
              {otpSent ? 'Verify OTP' : 'Log in or sign up'}
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center',
                maxWidth: 280,
              }}>
              {otpSent
                ? `We've sent a 6-digit code to your ${
                    inputMode === 'email' ? 'email' : 'phone number'
                  }`
                : 'Enter your phone number or email to continue'}
            </Text>
          </View>

          {/* Input Card */}
          <Surface
            style={{
              borderRadius: 20,
              padding: 20,
              gap: 16,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.outline,
            }}
            elevation={0}>
            {!otpSent ? (
              <>
                {/* Mode Toggle */}
                <SegmentedButtons
                  value={inputMode}
                  onValueChange={value => {
                    setInputMode(value as 'phone' | 'email');
                    setIdentifier('');
                    setError(null);
                  }}
                  buttons={[
                    {
                      value: 'phone',
                      label: '📱 Phone',
                      style: {
                        backgroundColor:
                          inputMode === 'phone'
                            ? theme.colors.surfaceVariant
                            : theme.colors.background,
                        borderColor: theme.colors.outline,
                      },
                      labelStyle: {
                        color:
                          inputMode === 'phone'
                            ? theme.colors.onSurface
                            : theme.colors.onSurfaceVariant,
                        fontWeight: '600',
                      },
                    },
                    {
                      value: 'email',
                      label: '✉️ Email',
                      style: {
                        backgroundColor:
                          inputMode === 'email'
                            ? theme.colors.surfaceVariant
                            : theme.colors.background,
                        borderColor: theme.colors.outline,
                      },
                      labelStyle: {
                        color:
                          inputMode === 'email'
                            ? theme.colors.onSurface
                            : theme.colors.onSurfaceVariant,
                        fontWeight: '600',
                      },
                    },
                  ]}
                />

                {/* Phone/Email Input */}
                {inputMode === 'phone' ? (
                  <View style={{flexDirection: 'row', gap: 10}}>
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
                      elevation={0}>
                      <Text style={{fontSize: 18}}>🇮🇳</Text>
                      <Text variant="bodyLarge" style={{fontWeight: '600'}}>
                        +91
                      </Text>
                    </Surface>
                    <TextInput
                      value={identifier}
                      onChangeText={setIdentifier}
                      placeholder="Enter Phone Number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      mode="outlined"
                      style={{
                        flex: 1,
                        backgroundColor: theme.colors.background,
                      }}
                      outlineStyle={{
                        borderRadius: 14,
                        borderColor: theme.colors.outline,
                      }}
                      textColor={theme.colors.onSurface}
                      placeholderTextColor={theme.colors.onSurfaceVariant}
                    />
                  </View>
                ) : (
                  <TextInput
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="Enter Email Address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    mode="outlined"
                    style={{backgroundColor: theme.colors.background}}
                    outlineStyle={{
                      borderRadius: 14,
                      borderColor: theme.colors.outline,
                    }}
                    textColor={theme.colors.onSurface}
                    placeholderTextColor={theme.colors.onSurfaceVariant}
                  />
                )}
              </>
            ) : (
              <Animated.View
                style={{
                  gap: 16,
                  alignItems: 'center',
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                }}>
                {/* Back button */}
                <TouchableRipple
                  onPress={handleBack}
                  style={{
                    alignSelf: 'flex-start',
                    borderRadius: 8,
                    padding: 4,
                  }}>
                  <Text
                    variant="labelMedium"
                    style={{color: theme.colors.onSurfaceVariant}}>
                    ← Change {inputMode === 'email' ? 'email' : 'number'}
                  </Text>
                </TouchableRipple>

                <Text variant="bodyMedium" style={{fontWeight: '500'}}>
                  {inputMode === 'email'
                    ? trimmedIdentifier.toLowerCase()
                    : `+91 ${trimmedIdentifier}`}
                </Text>

                {/* OTP Input Boxes */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 10,
                  }}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref: React.ElementRef<typeof TextInput> | null) => {
                        otpRefs.current[index] = ref;
                      }}
                      value={digit}
                      onChangeText={text =>
                        handleOtpChange(text.replace(/[^0-9]/g, ''), index)
                      }
                      onKeyPress={e => handleOtpKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      mode="outlined"
                      style={{
                        width: 46,
                        height: 54,
                        textAlign: 'center',
                        backgroundColor: digit
                          ? theme.colors.primaryContainer
                          : theme.colors.background,
                        fontSize: 20,
                        fontWeight: '700',
                      }}
                      outlineStyle={{
                        borderRadius: 14,
                        borderWidth: 1.5,
                        borderColor: digit
                          ? theme.colors.primary
                          : theme.colors.outline,
                      }}
                      textColor={theme.colors.onSurface}
                      selectionColor={theme.colors.primary}
                    />
                  ))}
                </View>

                {/* Resend */}
                <TouchableRipple
                  onPress={handleResendOtp}
                  disabled={loading}
                  style={{borderRadius: 8, padding: 4}}>
                  <Text
                    variant="bodySmall"
                    style={{color: theme.colors.onSurfaceVariant}}>
                    Didn't receive the code?{' '}
                    <Text
                      style={{color: theme.colors.primary, fontWeight: '600'}}>
                      Resend
                    </Text>
                  </Text>
                </TouchableRipple>
              </Animated.View>
            )}

            {/* Messages */}
            {message ? (
              <HelperText
                type="info"
                visible
                style={{textAlign: 'center', color: '#4ade80'}}>
                {message}
              </HelperText>
            ) : null}
            {error ? (
              <HelperText type="error" visible style={{textAlign: 'center'}}>
                {error}
              </HelperText>
            ) : null}

            {/* Continue / Verify Button */}
            <Button
              mode="contained"
              onPress={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={loading}
              loading={loading}
              contentStyle={{paddingVertical: 8}}
              style={{borderRadius: 16}}
              labelStyle={{fontSize: 16, fontWeight: '700'}}
              buttonColor={theme.colors.primary}
              textColor="#ffffff">
              {otpSent ? 'Verify & Continue' : 'Continue'}
            </Button>
          </Surface>

          {/* Footer */}
          <View
            style={{marginTop: 28, alignItems: 'center', paddingBottom: 24}}>
            <TouchableRipple
              onPress={() => navigation.navigate('SignUp')}
              style={{borderRadius: 8, padding: 8}}>
              <Text
                variant="bodyMedium"
                style={{color: theme.colors.onSurfaceVariant}}>
                Don't have an account?{' '}
                <Text style={{color: theme.colors.primary, fontWeight: '700'}}>
                  Sign Up
                </Text>
              </Text>
            </TouchableRipple>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
