import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PaperProvider, MD3DarkTheme} from 'react-native-paper';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import HomeScreen from './screens/HomeScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import VendorDetailsScreen from './view/VendorDetailsScreen';
import {RootStackParamList} from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#ef4444',
    primaryContainer: '#1a0a0a',
    secondary: '#f97316',
    secondaryContainer: '#1a0f05',
    surface: '#141414',
    surfaceVariant: '#1f1f1f',
    background: '#0a0a0a',
    error: '#f87171',
    errorContainer: '#2d1515',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#f5f5f5',
    onSurfaceVariant: '#9ca3af',
    onBackground: '#f5f5f5',
    onError: '#ffffff',
    outline: '#1f1f1f',
    outlineVariant: '#2a2a2a',
    elevation: {
      level0: 'transparent',
      level1: '#1a1a1a',
      level2: '#1f1f1f',
      level3: '#232323',
      level4: '#262626',
      level5: '#2a2a2a',
    },
  },
};

function AppNavigator() {
  const {session} = useAuth();

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#0a0a0a'},
          animation: 'slide_from_right',
        }}>
        {session ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen
              name="VendorDetails"
              component={VendorDetailsScreen}
            />
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
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
