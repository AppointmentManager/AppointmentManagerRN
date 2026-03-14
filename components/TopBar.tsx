import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useUserLocation } from '../hooks/useUserLocation';
import { useUserProfile } from '../hooks/useUserProfile';
import LocationSelectModal from './LocationSelectModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TopBar() {
    const navigation = useNavigation<NavigationProp>();
    const { location, isLoading: locationLoading } = useUserLocation();
    const { profile, isLoading: profileLoading } = useUserProfile();
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

    // Helper function to truncate address
    const truncateAddress = (address: string, maxLength: number = 30): string => {
        if (address.length <= maxLength) return address;
        return address.substring(0, maxLength) + '...';
    };

    return (
        <View style={styles.container}>
            {/* Top Row: Location, Badges, and Profile */}
            <View style={styles.topRow}>
                {/* Left: Location Section */}
                <View style={styles.locationSection}>
                    <TouchableOpacity
                        style={styles.locationHeader}
                        onPress={() => setIsLocationModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.homeIndicator} />
                        <Text style={styles.homeText}>
                            {location?.label || 'Home'}
                        </Text>
                        <Text style={styles.dropdownIcon}>▼</Text>
                    </TouchableOpacity>
                    {locationLoading ? (
                        <ActivityIndicator size="small" color="#888" style={styles.loader} />
                    ) : (
                        <Text style={styles.addressText}>
                            {location?.address
                                ? truncateAddress(location.address)
                                : '201, 2 Floor, Tower A3, Al...'}
                        </Text>
                    )}
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.profileBadge}
                        onPress={() => navigation.navigate('ProfileEdit')}
                    >
                        {profileLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.profileText}>
                                {profile?.initial || 'U'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search Shop..."'
                        placeholderTextColor="#888"
                        editable={true}
                        autoCorrect={false}
                        autoCapitalize="none"
                        returnKeyType="search"
                    />
                </View>
            </View>

            {/* Location Selection Modal */}
            <LocationSelectModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                currentLocation={location}
                onAddNewAddress={() => {
                    setIsLocationModalVisible(false);
                    // TODO: Navigate to add address screen
                    console.log('Add new address clicked');
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    locationSection: {
        flex: 1,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    homeIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00FF00',
        marginRight: 8,
    },
    homeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginRight: 4,
    },
    dropdownIcon: {
        fontSize: 12,
        color: '#FFFFFF',
    },
    addressText: {
        fontSize: 14,
        color: '#888',
        marginLeft: 16,
    },
    loader: {
        marginLeft: 16,
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    goldBadge: {
        backgroundColor: '#FFF8DC',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DAA520',
    },
    goldLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#DAA520',
    },
    goldAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#DAA520',
    },
    iconButton: {
        width: 40,
        height: 40,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletIcon: {
        fontSize: 20,
    },
    profileBadge: {
        width: 40,
        height: 40,
        backgroundColor: '#4169E1',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchIcon: {
        fontSize: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 0,
        minHeight: 40,
    },
    micIcon: {
        fontSize: 20,
    },
    toggleContainer: {
        alignItems: 'center',
        gap: 4,
    },
    toggleLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    toggleSwitch: {
        width: 30,
        height: 50,
        backgroundColor: '#00AA00',
        borderRadius: 15,
        justifyContent: 'flex-start',
        padding: 3,
    },
    toggleIndicator: {
        width: 24,
        height: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    toggleLabelOff: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#888',
    },
});
