import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Button,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/AuthContext';
import {RootStackParamList} from '../types/navigation';
import {useUserProfile} from '../hooks/useUserProfile';
import {UserService} from '../services/userService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileEditScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const {session} = useAuth();
  const userId = Number(session?.user.id || 0);
  const {profile, isLoading, error, refetch} = useUserProfile(userId);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      const nameParts = profile.name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(profile.email || '');
      setMobileNumber(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!firstName || !lastName || !email || !mobileNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsSaving(true);
    try {
      const result = await UserService.updateUserProfile(userId, {
        firstName,
        lastName,
        email,
        phone: mobileNumber,
      });

      if (result.success) {
        Alert.alert(
          'Success',
          result.message || 'Profile updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <Appbar.Header
          style={{backgroundColor: theme.colors.elevation.level1}}
          elevated>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            color={theme.colors.onSurface}
          />
          <Appbar.Content
            title="Edit Profile"
            titleStyle={{color: theme.colors.onSurface, fontWeight: 'bold'}}
          />
        </Appbar.Header>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}>
          <ActivityIndicator size="large" color="#4169E1" />
          <Text
            variant="bodyLarge"
            style={{color: theme.colors.onSurfaceVariant, marginTop: 12}}>
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <Appbar.Header
          style={{backgroundColor: theme.colors.elevation.level1}}
          elevated>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            color={theme.colors.onSurface}
          />
          <Appbar.Content
            title="Edit Profile"
            titleStyle={{color: theme.colors.onSurface, fontWeight: 'bold'}}
          />
        </Appbar.Header>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.error,
              textAlign: 'center',
              marginBottom: 16,
            }}>
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={refetch}
            buttonColor="#4169E1"
            textColor="#ffffff"
            style={{borderRadius: 12}}
            contentStyle={{paddingVertical: 4, paddingHorizontal: 16}}>
            Retry
          </Button>
        </View>
      </View>
    );
  }

  const displayInitial =
    profile?.initial || firstName?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      {/* Header */}
      <Appbar.Header
        style={{backgroundColor: theme.colors.elevation.level1}}
        elevated>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={theme.colors.onSurface}
        />
        <Appbar.Content
          title="Edit Profile"
          titleStyle={{color: theme.colors.onSurface, fontWeight: 'bold'}}
        />
      </Appbar.Header>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 32,
        }}>
        {/* Profile Picture Section */}
        <View style={{alignItems: 'center', marginBottom: 32}}>
          <View style={{position: 'relative', marginBottom: 12}}>
            <Avatar.Text
              size={100}
              label={displayInitial}
              style={{backgroundColor: '#4169E1'}}
              labelStyle={{fontSize: 42, fontWeight: 'bold'}}
            />
            <TouchableRipple
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 36,
                height: 36,
                backgroundColor: theme.colors.elevation.level5,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: theme.colors.background,
              }}
              onPress={() => {}}>
              <Text style={{fontSize: 18}}>📷</Text>
            </TouchableRipple>
          </View>
          <TouchableRipple
            onPress={() => {}}
            style={{borderRadius: 8, padding: 4}}>
            <Text
              variant="bodyLarge"
              style={{color: '#4169E1', fontWeight: '600'}}>
              Change Photo
            </Text>
          </TouchableRipple>
        </View>

        {/* Form Section */}
        <View style={{gap: 16, marginBottom: 24}}>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            label="First Name"
            placeholder="Enter first name"
            mode="outlined"
            style={{backgroundColor: theme.colors.background}}
            outlineStyle={{
              borderRadius: 12,
              borderColor: theme.colors.outlineVariant,
            }}
            textColor={theme.colors.onSurface}
          />

          <TextInput
            value={lastName}
            onChangeText={setLastName}
            label="Last Name"
            placeholder="Enter last name"
            mode="outlined"
            style={{backgroundColor: theme.colors.background}}
            outlineStyle={{
              borderRadius: 12,
              borderColor: theme.colors.outlineVariant,
            }}
            textColor={theme.colors.onSurface}
          />

          <TextInput
            value={email}
            onChangeText={setEmail}
            label="Email"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={{backgroundColor: theme.colors.background}}
            outlineStyle={{
              borderRadius: 12,
              borderColor: theme.colors.outlineVariant,
            }}
            textColor={theme.colors.onSurface}
          />

          <TextInput
            value={mobileNumber}
            onChangeText={setMobileNumber}
            label="Mobile Number"
            placeholder="+1 (555) 123-4567"
            keyboardType="phone-pad"
            mode="outlined"
            style={{backgroundColor: theme.colors.background}}
            outlineStyle={{
              borderRadius: 12,
              borderColor: theme.colors.outlineVariant,
            }}
            textColor={theme.colors.onSurface}
          />
        </View>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={isSaving}
          loading={isSaving}
          contentStyle={{paddingVertical: 8}}
          style={{borderRadius: 12, marginTop: 8}}
          labelStyle={{fontSize: 18, fontWeight: 'bold'}}
          buttonColor="#4169E1"
          textColor="#ffffff">
          Save Changes
        </Button>
      </ScrollView>
    </View>
  );
}
