# TemplateVoice

TemplateVoice is a React Native project designed for voice-enabled interactions. It leverages the **proxy-assistant-sdk** for handling various services like speech-to-text (STT), text-to-speech (TTS), and conversation management.

---

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- Watchman (for Metro bundler, optional but recommended)

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd TemplateVoice
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start --reset-cache
   ```

---

## Updating the SDK

If there are changes to the **proxy-assistant-sdk**, follow these steps to update the SDK in TemplateVoice:

1. **Rebuild the SDK**\
   Navigate to the SDK project directory and rebuild it:

   ```bash
   cd /path/to/proxy-assistant-sdk
   npm run build
   ```

2. **Pack the SDK**\
   Create a `.tgz` file for distribution:

   ```bash
   npm pack
   ```

   This will generate a file named something like `proxy-assistant-sdk-1.0.0.tgz` in the SDK directory.

3. **Uninstall the Current SDK**\
   Go back to the TemplateVoice project and uninstall the existing SDK:

   ```bash
   cd /path/to/TemplateVoice
   npm uninstall proxy-assistant-sdk
   ```

4. **Install the Updated SDK**\
   Install the newly packed SDK:

   ```bash
   npm install /path/to/proxy-assistant-sdk/proxy-assistant-sdk-1.0.0.tgz
   ```

5. **Restart the Development Server**\
   To ensure the changes are picked up, restart Metro with a cache reset:

   ```bash
   npm start --reset-cache
   ```

---

## Key Features

- **Voice Input**: Supports speech-to-text functionality for capturing user input.
- **Text-to-Speech (TTS)**: Plays audio responses generated from text.
- **Conversation History**: Automatically loads and updates conversation history.
- **Flexible Integration**: Uses a modular approach with `VoiceService` and `ConversationHandler` for clean architecture.

---

## File Structure

```plaintext
src/
├── components/         # Reusable UI components
├── screens/            # Main app screens
│   ├── ChatScreen/     # Chat interface
│   └── VoiceScreen/    # Voice interaction interface
├── services/           # Service integrations for STT, TTS, and conversation
├── types/              # TypeScript definitions
└── AppNavigator.tsx    # App navigation setup
```

---

## Running the App

1. Start the development server:

   ```bash
   npm start --reset-cache
   ```

2. Open the app:

   - **Android**: Press `a`
   - **iOS**: Press `i`
   - **Web**: Press `w`

---

## Troubleshooting

### 1. SDK Changes Are Not Reflecting

- Ensure you’ve rebuilt and packed the SDK (`npm run build` and `npm pack`).
- Uninstall and reinstall the SDK in TemplateVoice.
- Restart Metro with:
  ```bash
  npm start --reset-cache
  ```

### 2. TypeScript Errors

- Confirm the SDK is installed correctly by checking:
  ```bash
  ls node_modules/proxy-assistant-sdk
  ```
- Ensure your `tsconfig.json` includes:
  ```json
  "typeRoots": ["./node_modules/@types", "./src/@types"]
  ```

