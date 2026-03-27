import React from 'react';
import { View, Image } from 'react-native';
import {
    Avatar,
    Button,
    Card,
    Chip,
    Text,
    useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { VendorCardData } from '../types/vendor';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface VendorCardProps {
    vendor: VendorCardData;
}

export default function VendorCard({ vendor }: VendorCardProps) {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const vendorInitial = vendor.name.charAt(0).toUpperCase();

    const handlePress = () => {
        navigation.navigate('VendorDetails', { vendorId: vendor.id });
    };

    return (
        <Card
            style={{
                backgroundColor: theme.colors.elevation.level5,
                borderRadius: 16,
                marginBottom: 16,
            }}
            elevation={3}
            onPress={handlePress}
        >
            <Card.Content style={{ flexDirection: 'row', padding: 12, gap: 12 }}>
                {vendor.imageUrl ? (
                    <Image
                        source={{ uri: vendor.imageUrl }}
                        style={{ width: 100, height: 100, borderRadius: 12, backgroundColor: '#333' }}
                    />
                ) : (
                    <Avatar.Text
                        size={100}
                        label={vendorInitial}
                        style={{ backgroundColor: '#163d2a', borderRadius: 12 }}
                        labelStyle={{ fontSize: 32, fontWeight: '700' }}
                    />
                )}
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}>
                        <Text
                            variant="titleSmall"
                            style={{ fontWeight: 'bold', flex: 1, marginRight: 8 }}
                        >
                            {vendor.name}
                        </Text>
                        <Chip
                            compact
                            style={{
                                backgroundColor: theme.colors.elevation.level3,
                                height: 24,
                            }}
                            textStyle={{ fontSize: 12, fontWeight: 'bold' }}
                        >
                            ★ {vendor.rating !== null ? vendor.rating.toFixed(1) : 'New'}
                        </Chip>
                    </View>

                    <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                    >
                        {vendor.address}
                    </Text>

                    <Text
                        variant="labelSmall"
                        style={{
                            marginTop: 4,
                            fontWeight: '500',
                            color: vendor.isOpen ? '#00AA00' : '#FF8A80',
                        }}
                    >
                        {vendor.isOpen ? 'Open now' : 'Closed'} • {vendor.nextAvailableSlot}
                    </Text>

                    {/* Footer */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8,
                    }}>
                        <Chip
                            compact
                            mode="outlined"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'transparent',
                            }}
                            textStyle={{ fontSize: 10, color: '#CCC' }}
                        >
                            {vendor.category}
                        </Chip>
                        <Button
                            mode="contained"
                            compact
                            onPress={handlePress}
                            buttonColor="#00AA00"
                            textColor="#ffffff"
                            style={{ borderRadius: 20 }}
                            labelStyle={{ fontSize: 12, fontWeight: 'bold', marginVertical: 0 }}
                            contentStyle={{ paddingVertical: 0, height: 30 }}
                        >
                            Book
                        </Button>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}
