import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StoreCardData } from '../types/store';

interface StoreCardProps {
    store: StoreCardData;
}

export default function StoreCard({ store }: StoreCardProps) {
    const storeInitial = store.storeName.charAt(0).toUpperCase();

    return (
        <View style={styles.card}>
            <View style={styles.leading}>
                <Text style={styles.leadingText}>{storeInitial}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titleBlock}>
                        <Text style={styles.storeName}>{store.storeName}</Text>
                        <Text style={styles.vendorName}>{store.vendorName}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.star}>★</Text>
                        <Text style={styles.rating}>
                            {store.rating !== null ? store.rating.toFixed(1) : 'New'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.address}>{store.address}</Text>

                {store.description ? (
                    <Text style={styles.description} numberOfLines={2}>
                        {store.description}
                    </Text>
                ) : null}

                <View style={styles.availabilityPanel}>
                    <Text style={store.isOpen ? styles.openText : styles.closedText}>
                        {store.isOpen ? 'Open now' : 'Closed'}
                    </Text>
                    <Text style={styles.nextSlot}>Next: {store.nextAvailableSlot}</Text>
                    <Text style={styles.availabilitySummary}>{store.availabilitySummary}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.contactText}>{store.phone}</Text>
                    <Text style={styles.contactText}>{store.email}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#1f1f1f',
        borderRadius: 18,
        padding: 14,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
        gap: 12,
    },
    leading: {
        width: 68,
        height: 68,
        borderRadius: 16,
        backgroundColor: '#163d2a',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    leadingText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    titleBlock: {
        flex: 1,
    },
    storeName: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    vendorName: {
        color: '#7FAE8B',
        fontSize: 12,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2f2f2f',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },
    star: {
        color: '#FFD700',
        fontSize: 12,
        marginRight: 4,
    },
    rating: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    address: {
        color: '#B8B8B8',
        fontSize: 13,
        marginTop: 8,
    },
    description: {
        color: '#D8D8D8',
        fontSize: 13,
        lineHeight: 18,
        marginTop: 8,
    },
    availabilityPanel: {
        backgroundColor: '#262626',
        borderRadius: 14,
        padding: 12,
        marginTop: 12,
        gap: 4,
    },
    openText: {
        color: '#00AA00',
        fontSize: 13,
        fontWeight: '700',
    },
    closedText: {
        color: '#FF8A80',
        fontSize: 13,
        fontWeight: '700',
    },
    nextSlot: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    availabilitySummary: {
        color: '#B8B8B8',
        fontSize: 12,
    },
    footer: {
        marginTop: 12,
        gap: 2,
    },
    contactText: {
        color: '#9F9F9F',
        fontSize: 12,
    },
});
