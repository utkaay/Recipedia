# Recipedia

Recipedia is a personal recipe notebook for creating, organizing, and browsing recipes on a mobile device.

## Features

- Register and sign in with a local account, or use the sample account.
- Add, view, edit, and delete recipes.
- Search recipes by name and filter by category.
- View recipe and category counts on Home.
- Choose a color theme and change the password for a registered account.
- Save recipe collections and account information on the current device.

## Tech Stack

- Mobile app: React Native, Expo, Expo Router, React Context, AsyncStorage, Expo SecureStore, Zod, and `@expo/vector-icons`
- Tooling: ESLint with the Expo configuration

## Project Structure

- `src/app/` – Expo Router screens and navigation, including recipe details and editing routes
- `src/components/` – reusable buttons, inputs, recipe cards, forms, navigation, and feedback UI
- `src/context/` – shared session and recipe-collection state
- `src/data/` – starter recipes, categories, and sample-account credentials
- `src/schemas/` – Zod validation for forms and stored recipe data
- `src/storage/` – local recipe, account, and credential persistence
- `src/theme/` – palettes, shared visual values, and theme state
- `assets/` – app icons and recipe illustrations

## Getting Started

1. Install Node.js and npm.
2. From the project root, install the dependencies:

   ```sh
   npm install
   ```

3. Start Expo:

   ```sh
   npx expo start
   ```

4. Open the app in an emulator or device using a compatible Expo runtime. This project’s Expo Go/development-build test status has not been recorded.

Sample account:

- Email: `student@example.com`
- Password: `password2026`

The project also has `npm run android`, `npm run ios`, `npm run web`, and `npm run lint` scripts.

## Current Phase

This repository currently contains the Phase 1 application. It stores data locally on the device. There is no backend or Supabase integration in this phase. Registered accounts do not sync across devices, and there is no password-recovery service. The app signs out after a restart.

New accounts receive the six starter recipes when their recipe collection has never been saved. Existing collections, including an empty collection, are restored from AsyncStorage. Native account passwords use SecureStore; the web fallback uses AsyncStorage.

## Checks

Run the available project checks:

```sh
npm run lint
npx tsc --noEmit
npx expo export --platform web
```

There is no automated test script in `package.json`. Lint and web export have passed in the current workspace. The TypeScript command exits successfully, but the app source is JavaScript/JSX and is not covered by the current TypeScript configuration. Native-device behavior and full close/reopen persistence still need device testing.

## Manual Test Checklist

- Register and log in; check invalid input and incorrect credentials.
- Add, edit, cancel, and delete a recipe.
- Try combined name search and category filtering.
- Check that Home, Recipes, and Details show the current collection.
- Log out and verify Back does not return to signed-in screens.
- Close and reopen the app to confirm saved data persists.
- Check the empty collection and loading/storage error states.

No screenshots, screen-flow diagram, or demo video are included in this repository.
