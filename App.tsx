import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomeScreen from './screens/HomeScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import VendorDetailsScreen from './view/VendorDetailsScreen';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { session } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
          animation: 'slide_from_right',
        }}
      >
        {session ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
