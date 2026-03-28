# Android Network Fix Sequence (Physical Device + Emulator)

This document records the exact sequence used to fix Android app network failures when calling:

- `http://<host-ip>:8080/api/auth/send-otp`
- or `http://localhost:8080/api/...` from Android

## 1) Problem Observed

On Android, OTP API calls failed with:

- `Network request failed`

## 2) Root Cause Found

Two issues were identified:

1. Host IP mismatch (example: app was using `192.168.1.9`, machine was on `192.168.1.6`).
2. Android `localhost` does not point to the laptop backend unless ADB reverse is configured.

## 3) ADB Commands Used (In Order)

1. Check connected targets:

```bash
adb devices
```

2. Initial reverse attempt (failed because more than one target was connected):

```bash
adb reverse tcp:8080 tcp:8080
```

3. Apply reverse per device serial:

```bash
ANDROID_SERIAL=RZCT819Z9MY adb reverse tcp:8080 tcp:8080
ANDROID_SERIAL=emulator-5554 adb reverse tcp:8080 tcp:8080
```

4. Verify reverse per target:

```bash
ANDROID_SERIAL=RZCT819Z9MY adb reverse --list
ANDROID_SERIAL=emulator-5554 adb reverse --list
```

Expected output includes `tcp:8080 tcp:8080`.

## 4) Code Added

### File: `android/app/src/main/AndroidManifest.xml`

Added cleartext support in the main application manifest:

```xml
<application
  android:name=".MainApplication"
  android:label="@string/app_name"
  android:icon="@mipmap/ic_launcher"
  android:roundIcon="@mipmap/ic_launcher_round"
  android:allowBackup="false"
  android:usesCleartextTraffic="true"
  android:theme="@style/AppTheme"
  android:supportsRtl="true">
```

Why: ensures HTTP (`http://...`) works in Android builds where cleartext may otherwise be blocked.

## 5) Environment Value Used

Set API base URL to localhost in development env:

```env
API_BASE_URL="http://localhost:8080/api"
```

Why: with `adb reverse`, device `localhost:8080` maps to laptop `localhost:8080`.

## 6) Rebuild/Run Sequence

Run in this order:

```bash
npm start -- --reset-cache
npm run android
```

If multiple devices are connected, keep `adb reverse` applied for each target serial before running the app.

## 7) Quick Verification

1. `adb reverse --list` for the target includes `tcp:8080 tcp:8080`.
2. App OTP request reaches backend without `Network request failed`.
3. If still failing, verify backend is running and listening on `localhost:8080`.

