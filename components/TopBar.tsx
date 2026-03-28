import React, { useState } from 'react';
import { View } from 'react-native';
import {
    ActivityIndicator,
    Avatar,
    Searchbar,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { useUserLocation } from '../hooks/useUserLocation';
import { useUserProfile } from '../hooks/useUserProfile';
import LocationSelectModal from './LocationSelectModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TopBar() {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const { session } = useAuth();
    const userId = Number(session?.user.id || 0);
    const { location, isLoading: locationLoading } = useUserLocation(userId);
    const { profile, isLoading: profileLoading } = useUserProfile(userId);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const truncateAddress = (address: string, maxLength: number = 30): string => {
        if (address.length <= maxLength) {
            return address;
        }
        return address.substring(0, maxLength) + '...';
    };

    return (
        <Surface
            style={{
                backgroundColor: theme.colors.elevation.level1,
                paddingTop: 50,
                paddingHorizontal: 16,
                paddingBottom: 16,
            }}
            elevation={2}
        >
            {/* Top Row: Location, and Profile */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16,
            }}>
                {/* Left: Location Section */}
                <View style={{ flex: 1 }}>
                    <TouchableRipple
                        onPress={() => setIsLocationModalVisible(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 4,
                            borderRadius: 8,
                            padding: 4,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#00FF00',
                                marginRight: 8,
                            }} />
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginRight: 4 }}>
                                {location?.label || 'Home'}
                            </Text>
                            <Text variant="labelSmall">▼</Text>
                        </View>
                    </TouchableRipple>
                    {locationLoading ? (
                        <ActivityIndicator size="small" color={theme.colors.onSurfaceVariant} style={{ marginLeft: 16, marginTop: 4 }} />
                    ) : (
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 16 }}>
                            {location?.address
                                ? truncateAddress(location.address)
                                : '201, 2 Floor, Tower A3, Al...'}
                        </Text>
                    )}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableRipple
                        onPress={() => navigation.navigate('ProfileEdit')}
                        style={{ borderRadius: 20 }}
                    >
                        {profileLoading ? (
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#4169E1',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            </View>
                        ) : (
                            <Avatar.Text
                                size={40}
                                label={profile?.initial || 'U'}
                                style={{ backgroundColor: '#4169E1' }}
                                labelStyle={{ fontWeight: 'bold' }}
                            />
                        )}
                    </TouchableRipple>
                </View>
            </View>

            <Searchbar
                placeholder='Search Shop..."'
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    backgroundColor: theme.colors.elevation.level5,
                    borderRadius: 12,
                }}
                inputStyle={{ color: theme.colors.onSurface }}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                iconColor={theme.colors.onSurfaceVariant}
            />

            {/* Location Selection Modal */}
            <LocationSelectModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                currentLocation={location}
                onAddNewAddress={() => {
                    setIsLocationModalVisible(false);
                    console.log('Add new address clicked');
                }}
            />
        </Surface>
    );
}
