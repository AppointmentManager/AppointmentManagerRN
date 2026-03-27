/**
 * LocationSelectModal Component
 * Modal dialog for selecting a location or adding a new address
 */

import React from 'react';
import { View } from 'react-native';
import {
    Badge,
    Button,
    IconButton,
    Modal,
    Portal,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
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
    const theme = useTheme();

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={{
                    backgroundColor: theme.colors.elevation.level5,
                    marginHorizontal: 16,
                    borderRadius: 16,
                    padding: 20,
                    marginTop: 100,
                    alignSelf: 'center',
                    width: '92%',
                }}
            >
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                        Select Location
                    </Text>
                    <IconButton
                        icon="close"
                        size={20}
                        onPress={onClose}
                        style={{ backgroundColor: theme.colors.elevation.level3 }}
                        iconColor={theme.colors.onSurface}
                    />
                </View>

                {/* Current Location */}
                {currentLocation && (
                    <TouchableRipple
                        onPress={onClose}
                        style={{
                            borderRadius: 12,
                            marginBottom: 12,
                        }}
                    >
                        <Surface
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: theme.colors.elevation.level3,
                                borderRadius: 12,
                                padding: 16,
                            }}
                            elevation={0}
                        >
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: theme.colors.elevation.level4,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}>
                                <Text style={{ fontSize: 20 }}>📍</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 4 }}>
                                    {currentLocation.label}
                                </Text>
                                <Text
                                    variant="bodySmall"
                                    style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}
                                >
                                    {currentLocation.address}
                                </Text>
                            </View>
                            {currentLocation.isDefault && (
                                <Badge
                                    style={{
                                        backgroundColor: '#00AA00',
                                        alignSelf: 'center',
                                        paddingHorizontal: 8,
                                    }}
                                    size={24}
                                >
                                    Default
                                </Badge>
                            )}
                        </Surface>
                    </TouchableRipple>
                )}

                {/* Add New Address Button */}
                <Button
                    mode="contained"
                    icon="plus"
                    onPress={onAddNewAddress}
                    style={{ borderRadius: 12, marginTop: 8 }}
                    contentStyle={{ paddingVertical: 8 }}
                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                    buttonColor="#4169E1"
                    textColor="#ffffff"
                >
                    Add New Address
                </Button>
            </Modal>
        </Portal>
    );
}
