# Expo Mobile App Setup & Run Instructions

## 1. Prerequisites
- Node.js (v18+ recommended)
- Expo CLI: `npm install -g expo-cli`
- GitHub repo cloned locally

## 2. Install Dependencies
```sh
npm install
```

## 3. Start the App (Development)
```sh
npm start
```
- Or use:
  - `npm run android` (for Android device/emulator)
  - `npm run ios` (for iOS simulator/Mac only)
  - `npm run web` (for web preview)

## 4. Project Structure
- Main entry: `App.js`
- Screens: `src/screens/`
- Components: `src/components/`
- API config: `src/api/client.js`, `src/config/api.js`
- Navigation: `src/navigation/AppNavigator.js`

## 5. Backend Integration
- Backend URL is set in `app.json` under `expo.extra.backendUrl`
- Update this value if your backend URL changes

## 6. Testing
```sh
npm test
```

## 7. Build for Production
- Use EAS or Expo build service for production builds
- See https://docs.expo.dev/build/introduction/

---

**After setup, update the checklist and mark this step complete.**
