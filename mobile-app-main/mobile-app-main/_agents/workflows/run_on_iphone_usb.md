---
description: Run React Native app on physical iPhone via Expo (USB cable)
---
1. **Prerequisites**
   - Ensure you have **Xcode** installed on your Mac (required for USB device debugging).
   - Install the **Expo Go** app on your iPhone from the App Store.
   - Connect your iPhone to your Mac via a USB cable.
   - Trust the computer on your iPhone if prompted.
2. **Start the Metro Bundler**
   ```bash
   cd /Users/ujwalsingamsetti/cancer-app/AI-Cancer-Prediction-System-Final/mobile-app
   npx expo start --clear
   ```
   This will launch the Expo developer tools in your browser.
3. **Select the "Run on iOS device" option**
   - In the Expo DevTools UI, click **Run on iOS device**.
   - Expo will detect the connected iPhone and open the app in **Expo Go** automatically.
   - If the app does not launch, click **Open on iOS device** manually.
4. **Debugging**
   - Open **Console.app** on macOS and filter by your device name to view logs.
   - Use **React Native Debugger** or **Flipper** for advanced debugging.
5. **Hot Reload / Fast Refresh**
   - Changes you make in the code will automatically refresh on the device.
6. **Stopping the server**
   - Press `Ctrl + C` in the terminal to stop the Metro bundler.
7. **Optional: Build a standalone app** (if you need a production binary)
   ```bash
   npx expo build:ios
   ```
   Follow the prompts to generate an IPA for distribution via TestFlight or the App Store.

**Note**: If you encounter "Project is incompatible" errors, verify that the `sdkVersion` in `app.json` matches the version of Expo Go installed on your iPhone (e.g., `54.0.0`).
