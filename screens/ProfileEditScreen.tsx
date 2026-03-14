import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useUserProfile } from '../hooks/useUserProfile';
import { UserService } from '../services/userService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileEditScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { profile, isLoading, error, refetch } = useUserProfile();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Populate form fields when profile data is fetched
    useEffect(() => {
        if (profile) {
            const nameParts = profile.name.split(' ');
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            setEmail(profile.email || '');
            setMobileNumber(profile.phone || '');
        }
    }, [profile]);

    const handleSave = async () => {
        // Basic validation
        if (!firstName || !lastName || !email || !mobileNumber) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsSaving(true);
        try {
            const result = await UserService.updateUserProfile({
                firstName,
                lastName,
                email,
                phone: mobileNumber,
            });

            if (result.success) {
                Alert.alert('Success', result.message || 'Profile updated successfully!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]);
            } else {
                Alert.alert('Error', result.error || 'Failed to update profile');
            }
        } catch (err) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#4169E1" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const displayInitial = profile?.initial || firstName?.charAt(0)?.toUpperCase() || '?';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Profile Picture Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profilePictureContainer}>
                        <View style={styles.profileBadge}>
                            <Text style={styles.profileText}>{displayInitial}</Text>
                        </View>
                        <TouchableOpacity style={styles.cameraButton}>
                            <Text style={styles.cameraIcon}>📷</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    {/* First Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter first name"
                            placeholderTextColor="#666"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    {/* Last Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter last name"
                            placeholderTextColor="#666"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="email@example.com"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Mobile Number */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+1 (555) 123-4567"
                            placeholderTextColor="#666"
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#1a1a1a',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 28,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    profilePictureContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    profileBadge: {
        width: 100,
        height: 100,
        backgroundColor: '#4169E1',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        backgroundColor: '#2a2a2a',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#0a0a0a',
    },
    cameraIcon: {
        fontSize: 18,
    },
    changePhotoText: {
        fontSize: 16,
        color: '#4169E1',
        fontWeight: '600',
    },
    formSection: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#4169E1',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    loadingText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
    errorText: {
        fontSize: 16,
        color: '#FF6B6B',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#4169E1',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 32,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
