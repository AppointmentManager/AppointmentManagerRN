import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { VendorDetailsData } from '../types/vendor';
import { VendorService } from '../services/vendorService';
import TimeSlotModal from './TimeSlotModal';

type VendorDetailsRouteProp = RouteProp<RootStackParamList, 'VendorDetails'>;

export default function VendorDetailsScreen() {
    const route = useRoute<VendorDetailsRouteProp>();
    const navigation = useNavigation();
    const { vendorId } = route.params;
    const [vendor, setVendor] = useState<VendorDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [slots, setSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchVendor = async () => {
            setLoading(true);
            const response = await VendorService.getVendorDetails(vendorId);

            if (!isMounted) {
                return;
            }

            if (response.success && response.data) {
                setVendor(response.data);
                setError(null);
            } else {
                setVendor(null);
                setError(response.error || 'Vendor not found');
            }

            setLoading(false);
        };

        fetchVendor();

        return () => {
            isMounted = false;
        };
    }, [vendorId]);

    const handleServicePress = async (serviceId: number) => {
        setModalVisible(true);
        setLoadingSlots(true);
        const response = await VendorService.getAvailableSlots(vendorId, serviceId);
        setSlots(response.success && response.data ? response.data : []);
        setLoadingSlots(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00AA00" />
            </View>
        );
    }

    if (!vendor) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Vendor not found'}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const vendorInitial = vendor.name.charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {vendor.imageUrl ? (
                    <Image source={{ uri: vendor.imageUrl }} style={styles.coverImage} />
                ) : (
                    <View style={[styles.coverImage, styles.coverFallback]}>
                        <Text style={styles.coverFallbackText}>{vendorInitial}</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{vendor.name}</Text>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.star}>★</Text>
                            <Text style={styles.rating}>
                                {vendor.rating !== null ? vendor.rating.toFixed(1) : 'New'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.address}>{vendor.address}</Text>

                    <View style={styles.statusContainer}>
                        <Text style={vendor.isOpen ? styles.openBadge : styles.closedBadge}>
                            {vendor.isOpen ? 'Open Now' : 'Closed'}
                        </Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.category}>{vendor.category}</Text>
                    </View>

                    <Text style={styles.nextSlot}>Next available: {vendor.nextAvailableSlot}</Text>

                    {vendor.description ? (
                        <Text style={styles.description}>{vendor.description}</Text>
                    ) : null}

                    <View style={styles.contactCard}>
                        <Text style={styles.contactLabel}>Email</Text>
                        <Text style={styles.contactValue}>{vendor.email}</Text>
                        <Text style={styles.contactLabel}>Phone</Text>
                        <Text style={styles.contactValue}>{vendor.phone}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Services</Text>

                    <View style={styles.servicesList}>
                        {vendor.services.length === 0 ? (
                            <Text style={styles.emptyServicesText}>No services published yet.</Text>
                        ) : (
                            vendor.services.map(service => (
                                <TouchableOpacity
                                    key={service.id}
                                    style={styles.serviceItem}
                                    onPress={() => handleServicePress(service.id)}
                                    activeOpacity={0.85}
                                >
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceName}>{service.name}</Text>
                                        <Text style={styles.serviceMeta}>
                                            {service.durationMinutes} min • {service.category}
                                        </Text>
                                    </View>
                                    <View style={styles.serviceAction}>
                                        <Text style={styles.servicePrice}>${service.price.toFixed(2)}</Text>
                                        <View style={styles.bookServiceButton}>
                                            <Text style={styles.bookServiceButtonText}>Book</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            <TimeSlotModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                slots={slots}
                loading={loadingSlots}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 24,
    },
    errorText: {
        color: '#FF8A80',
        fontSize: 18,
        marginBottom: 16,
        textAlign: 'center',
    },
    backText: {
        color: '#00AA00',
        fontSize: 16,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    coverImage: {
        width: '100%',
        height: 250,
        backgroundColor: '#333333',
    },
    coverFallback: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#163d2a',
    },
    coverFallbackText: {
        fontSize: 72,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    star: {
        color: '#FFD700',
        fontSize: 14,
        marginRight: 4,
    },
    rating: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 14,
        color: '#AAAAAA',
        marginBottom: 12,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    openBadge: {
        color: '#00AA00',
        fontWeight: 'bold',
    },
    closedBadge: {
        color: '#FF8A80',
        fontWeight: 'bold',
    },
    dot: {
        color: '#888888',
        marginHorizontal: 8,
    },
    category: {
        color: '#DDDDDD',
    },
    nextSlot: {
        fontSize: 14,
        color: '#9ED5A6',
        marginBottom: 16,
    },
    description: {
        color: '#DDDDDD',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    contactCard: {
        backgroundColor: '#222222',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        gap: 4,
    },
    contactLabel: {
        color: '#7FAE8B',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
    },
    contactValue: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    servicesList: {
        gap: 12,
    },
    emptyServicesText: {
        color: '#CCCCCC',
        fontSize: 15,
    },
    serviceItem: {
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    serviceInfo: {
        flex: 1,
        gap: 4,
    },
    serviceName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    serviceMeta: {
        color: '#A8A8A8',
        fontSize: 13,
    },
    serviceAction: {
        alignItems: 'flex-end',
        gap: 8,
    },
    servicePrice: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    bookServiceButton: {
        backgroundColor: '#00AA00',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
    },
    bookServiceButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
});
