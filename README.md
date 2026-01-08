# StapuBox OTP - Android Assignment

A "Pixel Perfect", high-performance React Native Login & OTP Verification flow built for Android.

## 📱 Features

*   **Secure OTP Login**: End-to-end flow with Send/Resend/Verify APIs.
*   **Auto-Read SMS (Android)**: Implements Google's **SMS Retriever API** for magic one-tap verification without permission prompts.
*   **"Sports UX" Design**: Dark mode aesthetic, smooth 60fps animations (`react-native-reanimated`), and native `slide_from_right` transitions.
*   **Robust Error Handling**:
    *   Specific feedback for "Wrong OTP" (handled via 400/422 status mapping).
    *   Offline detection ("No internet connection").
    *   Server Timeout handling (522 errors).
*   **Deep Linking**: Supports `stapubox://verify?mobile=...` schemes.
*   **Polish**: Skeleton loaders, auto-focus inputs, and error shaking animations.

## 🛠️ Tech Stack

*   **Framework**: React Native (Expo SDK 50+)
*   **Language**: TypeScript
*   **Navigation**: Expo Router (File-based routing)
*   **Styling**: StyleSheet (Performance optimization)
*   **Animations**: React Native Reanimated
*   **SMS**: `react-native-otp-verify` (SMS Retriever API)

## 🚀 How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Metro Bundler**:
    ```bash
    npx expo start
    ```

3.  **Run on Android**:
    *   **Expo Go**: Scan QR code (Note: Auto-read SMS won't work in Expo Go, use Manual entry).
    *   **Development Build (Recommended for full features)**:
        ```bash
        npx expo run:android
        ```

## 🧪 Testing Auto-Read SMS (Emulator/ADB)

To verify the SMS Retriever logic without a real backend SMS:

1.  Open the app in an Emulator.
4.  **Testing the Provided APK**:
    *   The App Hash for the release APK is **`bIAW0tvAsG2`**.
    *   Use this command to verify the auto-read feature:
        ```bash
        adb shell am broadcast -a com.google.android.gms.auth.api.phone.SMS_RETRIEVED --es "sms_message" "<#> Your OTP is 1234 bIAW0tvAsG2"
        ```
    *   *Note: Since the backend SMS does not include this hash, this ADB command is required to demo the feature.*

## 📂 Project Structure

*   `app/index.tsx`: Login Screen (Mobile Entry + Validation).
*   `app/verify.tsx`: Verification Logic (SMS Listening, OTP Input, Timer).
*   `app/details.tsx`: User Details Form (Post-verification).
*   `src/services/api.ts`: Centralized API logic with Error Interceptors.
*   `src/components/`: Reusable UI (Skeletons, Buttons).

## ✅ Deliverables Checklist

- [x] Screen 1 (Send OTP) & API
- [x] Screen 2 (Verify OTP) & API
- [x] Auto-read SMS (SMS Retriever API)
- [x] Auto-submit on filled
- [x] Resend with Timer (60s)
- [x] "Change Number" flow
- [x] Design Polish (Dark Mode, Animations)
- [x] Extra: Skeleton Loaders, Deep Linking, Tests
