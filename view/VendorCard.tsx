import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
    const vendorInitial = vendor.name.charAt(0).toUpperCase();

    const handlePress = () => {
        navigation.navigate('VendorDetails', { vendorId: vendor.id });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
            {vendor.imageUrl ? (
                <Image source={{ uri: vendor.imageUrl }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.imageFallback]}>
                    <Text style={styles.imageFallbackText}>{vendorInitial}</Text>
                </View>
            )}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{vendor.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.star}>★</Text>
                        <Text style={styles.rating}>
                            {vendor.rating !== null ? vendor.rating.toFixed(1) : 'New'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.address}>{vendor.address}</Text>
                <Text style={[styles.nextSlot, vendor.isOpen ? styles.openText : styles.closedText]}>
                    {vendor.isOpen ? 'Open now' : 'Closed'} • {vendor.nextAvailableSlot}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{vendor.category}</Text>
                    </View>
                    <TouchableOpacity style={styles.bookButton} onPress={handlePress}>
                        <Text style={styles.bookButtonText}>Book</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#2a2a2a',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#333',
    },
    imageFallback: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#163d2a',
    },
    imageFallbackText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    star: {
        color: '#FFD700',
        fontSize: 12,
        marginRight: 4,
    },
    rating: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    nextSlot: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    openText: {
        color: '#00AA00',
    },
    closedText: {
        color: '#FF8A80',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    categoryBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 10,
        color: '#CCC',
    },
    bookButton: {
        backgroundColor: '#00AA00',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    bookButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
