/**
 * LocationSelectModal Component
 * Modal dialog for selecting a location or adding a new address
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { UserLocation } from '../types/types';

interface LocationSelectModalProps {
    visible: boolean;
    onClose: () => void;
    currentLocation: UserLocation | null;
    onAddNewAddress: () => void;
}

export default function LocationSelectModal({
    visible,
    onClose,
    currentLocation,
    onAddNewAddress,
}: LocationSelectModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable
                style={styles.modalOverlay}
                onPress={onClose}
            >
                <Pressable
                    style={styles.modalContent}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Location</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Current Location */}
                    {currentLocation && (
                        <TouchableOpacity
                            style={styles.locationItem}
                            onPress={onClose}
                        >
                            <View style={styles.locationItemIcon}>
                                <Text style={styles.locationIconText}>📍</Text>
                            </View>
                            <View style={styles.locationItemContent}>
                                <Text style={styles.locationItemLabel}>{currentLocation.label}</Text>
                                <Text style={styles.locationItemAddress}>{currentLocation.address}</Text>
                            </View>
                            {currentLocation.isDefault && (
                                <View style={styles.defaultBadge}>
                                    <Text style={styles.defaultBadgeText}>Default</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    {/* Add New Address Button */}
                    <TouchableOpacity
                        style={styles.addAddressButton}
                        onPress={onAddNewAddress}
                    >
                        <Text style={styles.addAddressIcon}>+</Text>
                        <Text style={styles.addAddressText}>Add New Address</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-start',
        paddingTop: 100,
    },
    modalContent: {
        backgroundColor: '#2a2a2a',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3a3a3a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a3a3a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    locationItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4a4a4a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    locationIconText: {
        fontSize: 20,
    },
    locationItemContent: {
        flex: 1,
    },
    locationItemLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    locationItemAddress: {
        fontSize: 14,
        color: '#888',
        lineHeight: 20,
    },
    defaultBadge: {
        backgroundColor: '#00AA00',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    defaultBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4169E1',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    addAddressIcon: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginRight: 8,
    },
    addAddressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
