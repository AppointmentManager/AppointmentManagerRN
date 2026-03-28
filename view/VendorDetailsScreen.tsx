import React, {useEffect, useState} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {VendorDetailsData} from '../types/vendor';
import {VendorService} from '../services/vendorService';
import TimeSlotModal from './TimeSlotModal';

type VendorDetailsRouteProp = RouteProp<RootStackParamList, 'VendorDetails'>;

export default function VendorDetailsScreen() {
  const route = useRoute<VendorDetailsRouteProp>();
  const navigation = useNavigation();
  const theme = useTheme();
  const {vendorId} = route.params;
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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.elevation.level1,
        }}>
        <ActivityIndicator size="large" color="#00AA00" />
      </View>
    );
  }

  if (!vendor) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.elevation.level1,
          paddingHorizontal: 24,
        }}>
        <Text
          variant="bodyLarge"
          style={{color: '#FF8A80', marginBottom: 16, textAlign: 'center'}}>
          {error || 'Vendor not found'}
        </Text>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor="#00AA00">
          Go Back
        </Button>
      </View>
    );
  }

  const vendorInitial = vendor.name.charAt(0).toUpperCase();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.elevation.level1}}>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        {vendor.imageUrl ? (
          <Image
            source={{uri: vendor.imageUrl}}
            style={{width: '100%', height: 250, backgroundColor: '#333333'}}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: 250,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#163d2a',
            }}>
            <Text style={{fontSize: 72, fontWeight: '700', color: '#FFFFFF'}}>
              {vendorInitial}
            </Text>
          </View>
        )}

        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: 40,
            left: 8,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          iconColor="#FFFFFF"
        />

        <View style={{padding: 20}}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
              gap: 12,
            }}>
            <Text variant="headlineSmall" style={{fontWeight: 'bold', flex: 1}}>
              {vendor.name}
            </Text>
            <Chip
              compact
              style={{backgroundColor: theme.colors.elevation.level3}}
              textStyle={{fontWeight: 'bold'}}>
              ★ {vendor.rating !== null ? vendor.rating.toFixed(1) : 'New'}
            </Chip>
          </View>

          <Text
            variant="bodyMedium"
            style={{color: '#AAAAAA', marginBottom: 12}}>
            {vendor.address}
          </Text>

          {/* Status */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <Text
              variant="labelLarge"
              style={{
                color: vendor.isOpen ? '#00AA00' : '#FF8A80',
                fontWeight: 'bold',
              }}>
              {vendor.isOpen ? 'Open Now' : 'Closed'}
            </Text>
            <Text style={{color: '#888888', marginHorizontal: 8}}>•</Text>
            <Text variant="bodyMedium" style={{color: '#DDDDDD'}}>
              {vendor.category}
            </Text>
          </View>

          <Text
            variant="bodyMedium"
            style={{color: '#9ED5A6', marginBottom: 16}}>
            Next available: {vendor.nextAvailableSlot}
          </Text>

          {vendor.description ? (
            <Text
              variant="bodyMedium"
              style={{color: '#DDDDDD', lineHeight: 20, marginBottom: 16}}>
              {vendor.description}
            </Text>
          ) : null}

          {/* Contact Card */}
          <Card
            style={{
              backgroundColor: theme.colors.elevation.level2,
              borderRadius: 16,
              marginBottom: 24,
            }}
            elevation={0}>
            <Card.Content style={{gap: 4}}>
              <Text
                variant="labelSmall"
                style={{
                  color: '#7FAE8B',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginTop: 4,
                }}>
                Email
              </Text>
              <Text variant="bodyMedium">{vendor.email}</Text>
              <Text
                variant="labelSmall"
                style={{
                  color: '#7FAE8B',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginTop: 4,
                }}>
                Phone
              </Text>
              <Text variant="bodyMedium">{vendor.phone}</Text>
            </Card.Content>
          </Card>

          <Text
            variant="titleMedium"
            style={{fontWeight: 'bold', marginBottom: 16}}>
            Services
          </Text>

          {/* Services List */}
          <View style={{gap: 12}}>
            {vendor.services.length === 0 ? (
              <Text variant="bodyLarge" style={{color: '#CCCCCC'}}>
                No services published yet.
              </Text>
            ) : (
              vendor.services.map(service => (
                <Card
                  key={service.id}
                  style={{
                    backgroundColor: theme.colors.elevation.level3,
                    borderRadius: 16,
                  }}
                  elevation={0}
                  onPress={() => handleServicePress(service.id)}>
                  <Card.Content
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <View style={{flex: 1, gap: 4}}>
                      <Text variant="titleSmall" style={{fontWeight: '600'}}>
                        {service.name}
                      </Text>
                      <Text variant="bodySmall" style={{color: '#A8A8A8'}}>
                        {service.durationMinutes} min • {service.category}
                      </Text>
                    </View>
                    <View style={{alignItems: 'flex-end', gap: 8}}>
                      <Text variant="titleSmall" style={{fontWeight: '700'}}>
                        ${service.price.toFixed(2)}
                      </Text>
                      <Button
                        mode="contained"
                        compact
                        buttonColor="#00AA00"
                        textColor="#ffffff"
                        style={{borderRadius: 999}}
                        labelStyle={{
                          fontSize: 12,
                          fontWeight: '700',
                          marginVertical: 0,
                        }}
                        contentStyle={{paddingVertical: 0, height: 30}}>
                        Book
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
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
