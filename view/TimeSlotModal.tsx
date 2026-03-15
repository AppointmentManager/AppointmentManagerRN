import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';

interface TimeSlotModalProps {
    visible: boolean;
    onClose: () => void;
    slots: string[];
    loading: boolean;
}

export default function TimeSlotModal({ visible, onClose, slots, loading }: TimeSlotModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => { /* Prevent closing when clicking inside modal content */ }}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Time</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={styles.closeButton}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {loading ? (
                                <ActivityIndicator size="large" color="#00AA00" style={styles.modalLoader} />
                            ) : slots.length === 0 ? (
                                <Text style={styles.emptyText}>No slots available right now.</Text>
                            ) : (
                                <FlatList
                                    data={slots}
                                    numColumns={4}
                                    keyExtractor={(item) => item}
                                    contentContainerStyle={styles.slotsGrid}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.slotItem}>
                                            <Text style={styles.slotText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 300,
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
        fontSize: 24,
        color: '#888',
    },
    modalLoader: {
        marginTop: 50,
    },
    emptyText: {
        color: '#CCCCCC',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    slotsGrid: {
        gap: 10,
    },
    slotItem: {
        flex: 1,
        backgroundColor: '#333',
        paddingVertical: 12,
        margin: 4,
        borderRadius: 8,
        alignItems: 'center',
    },
    slotText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
