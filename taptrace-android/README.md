# TAPTRACE Android Prototype

A dark, mobile-first spending tracker prototype for Sri Lanka. It includes:
- Dashboard with sample LKR spending
- Transaction search and detail view
- Add/delete demo expenses
- Category spending insights and editable monthly budget
- BOC connection screen with safe demo-only behavior

## Important
This is a **prototype using fictional sample data**. It does not connect to Bank of Ceylon or any bank, and it does not read ATM cards, SMS messages, or real bank transactions. Live banking requires an authorized BOC API or approved provider and appropriate agreements. Never enter a bank password, ATM PIN, or CVV into this app.

## Requirements
- Windows 10/11
- Node.js LTS (install from https://nodejs.org/)
- Internet connection for first install
- Optional: Android phone with Expo Go, or Android Studio emulator

## Run from CMD
1. Extract the ZIP file.
2. Open Command Prompt in the extracted `taptrace-android` folder.
3. Run:

```bat
npm install
npx expo start
```

4. Install **Expo Go** on your Android phone.
5. Make sure your phone and computer are on the same Wi-Fi network.
6. Scan the QR code shown in the terminal using Expo Go. If the connection fails, stop the server with Ctrl+C and run:

```bat
npx expo start --tunnel
```

If you installed Android Studio and configured an emulator, you can instead run:

```bat
npm run android
```

## Useful commands
```bat
npm run typecheck
npx expo start --clear
```

## Project structure
- `App.tsx` — prototype screens and interactions
- `app.json` — Expo app configuration
- `package.json` — dependencies and run scripts

## Before a public release
Add real authentication, secure backend storage, privacy policy, terms, app icon and splash assets, testing, and a verified authorized banking integration. Do not describe the prototype as live-connected to BOC.
