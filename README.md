# AppointmentManager Frontend

This is the frontend application for **AppointmentManager**, a comprehensive appointment booking and management system built with [**React Native**](https://reactnative.dev).

## About the Project

AppointmentManager is a mobile application that connects users with vendors through a seamless appointment booking experience:

### Features

**For Users:**
- Browse available vendors and their services
- Book appointments based on vendor availability
- View and manage upcoming appointments
- Receive notifications for appointment confirmations and reminders

**For Vendors:**
- Create and manage your business profile page
- Set up customizable time schedules and availability slots
- Manage appointment bookings from customers
- Track and organize appointments efficiently

## Prerequisites

Before you begin, make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions. You'll need:
- Node.js (v14 or later)
- npm or Yarn
- For Android: Android Studio and Android SDK
- For iOS: Xcode (macOS only)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AppointmentManagerRN
```

2. Install dependencies:
```bash
npm install
# OR
yarn install
```

## Running the Application

### Step 1: Start Metro Bundler

First, start the Metro bundler from the root of the project:

```bash
npm start
# OR
yarn start
```

To clear the cache (useful when encountering issues):
```bash
npm start -- --reset-cache
```

### Step 2: Run on Your Device

Keep Metro Bundler running in its terminal. Open a new terminal and run:

#### For Android

```bash
npm run android
# OR
yarn android
```

Make sure you have an Android emulator running or a physical device connected via USB with USB debugging enabled.

#### For iOS

```bash
npm run ios
# OR
yarn ios
```

This requires macOS and Xcode. The app will launch in the iOS Simulator.

## Development

### Viewing Changes

After making code changes, you can reload the app:

- **Android**: Press <kbd>R</kbd> twice or open the Developer Menu (<kbd>Cmd ⌘</kbd> + <kbd>M</kbd> on macOS, <kbd>Ctrl</kbd> + <kbd>M</kbd> on Windows/Linux) and select "Reload"
- **iOS**: Press <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in the iOS Simulator

### Quick Start Command

To see changes in this project, simply run:

```bash
npm start
```

Then in a separate terminal:

```bash
# For Android
npm run android

# For iOS  
npm run ios
```

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Developers

 - [Vedant Deshpande](https://github.com/vedantnd111)
 - [Saurabh Vidhate](https://github.com/PRIME-SV)
 - [Satyanarayan Jadhav](https://github.com/satyanarayan)