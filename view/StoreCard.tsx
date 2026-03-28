import React from 'react';
import {View} from 'react-native';
import {Avatar, Card, Chip, Text, useTheme} from 'react-native-paper';
import {StoreCardData} from '../types/store';

interface StoreCardProps {
  store: StoreCardData;
}

export default function StoreCard({store}: StoreCardProps) {
  const theme = useTheme();
  const storeInitial = store.storeName.charAt(0).toUpperCase();

  return (
    <Card
      style={{
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 18,
        marginBottom: 16,
      }}
      elevation={2}>
      <Card.Content
        style={{flexDirection: 'row', gap: 12, paddingVertical: 14}}>
        <Avatar.Text
          size={68}
          label={storeInitial}
          style={{backgroundColor: '#163d2a', borderRadius: 16}}
          labelStyle={{fontSize: 28, fontWeight: '700'}}
        />

        <View style={{flex: 1}}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8,
            }}>
            <View style={{flex: 1}}>
              <Text variant="titleMedium" style={{fontWeight: '700'}}>
                {store.storeName}
              </Text>
              <Text
                variant="labelSmall"
                style={{
                  color: '#7FAE8B',
                  marginTop: 2,
                  textTransform: 'uppercase',
                }}>
                {store.vendorName}
              </Text>
            </View>
            <Chip
              compact
              style={{
                backgroundColor: theme.colors.elevation.level3,
                height: 28,
              }}
              textStyle={{fontSize: 12, fontWeight: '700'}}>
              ★ {store.rating !== null ? store.rating.toFixed(1) : 'New'}
            </Chip>
          </View>

          <Text variant="bodySmall" style={{color: '#B8B8B8', marginTop: 8}}>
            {store.address}
          </Text>

          {store.description ? (
            <Text
              variant="bodySmall"
              numberOfLines={2}
              style={{color: '#D8D8D8', lineHeight: 18, marginTop: 8}}>
              {store.description}
            </Text>
          ) : null}

          {/* Availability Panel */}
          <Card
            style={{
              backgroundColor: theme.colors.elevation.level3,
              borderRadius: 14,
              marginTop: 12,
            }}
            elevation={0}>
            <Card.Content style={{gap: 4, paddingVertical: 12}}>
              <Text
                variant="labelMedium"
                style={{
                  color: store.isOpen ? '#00AA00' : '#FF8A80',
                  fontWeight: '700',
                }}>
                {store.isOpen ? 'Open now' : 'Closed'}
              </Text>
              <Text variant="bodySmall" style={{fontWeight: '600'}}>
                Next: {store.nextAvailableSlot}
              </Text>
              <Text variant="labelSmall" style={{color: '#B8B8B8'}}>
                {store.availabilitySummary}
              </Text>
            </Card.Content>
          </Card>

          {/* Footer */}
          <View style={{marginTop: 12, gap: 2}}>
            <Text variant="labelSmall" style={{color: '#9F9F9F'}}>
              {store.phone}
            </Text>
            <Text variant="labelSmall" style={{color: '#9F9F9F'}}>
              {store.email}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
