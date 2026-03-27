import React from 'react';
import {View, FlatList} from 'react-native';
import {
  ActivityIndicator,
  Chip,
  IconButton,
  Modal,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';

interface TimeSlotModalProps {
  visible: boolean;
  onClose: () => void;
  slots: string[];
  loading: boolean;
}

export default function TimeSlotModal({
  visible,
  onClose,
  slots,
  loading,
}: TimeSlotModalProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: theme.colors.elevation.level1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          minHeight: 300,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Text variant="titleLarge" style={{fontWeight: 'bold'}}>
            Select Time
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            iconColor={theme.colors.onSurfaceVariant}
          />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00AA00"
            style={{marginTop: 50}}
          />
        ) : slots.length === 0 ? (
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
              marginTop: 40,
            }}>
            No slots available right now.
          </Text>
        ) : (
          <FlatList
            data={slots}
            numColumns={4}
            keyExtractor={item => item}
            contentContainerStyle={{gap: 10}}
            renderItem={({item}) => (
              <Chip
                mode="outlined"
                onPress={() => {}}
                style={{
                  flex: 1,
                  margin: 4,
                  backgroundColor: theme.colors.elevation.level3,
                  borderColor: theme.colors.outlineVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                textStyle={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {item}
              </Chip>
            )}
          />
        )}
      </Modal>
    </Portal>
  );
}
