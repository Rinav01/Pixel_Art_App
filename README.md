# Pixel Art App

A powerful and intuitive pixel art editor built with React Native and Expo.

## Features

*   **Drawing Tools:** A toolbar with essential tools like a pencil, eraser, and paint bucket.
*   **Zoom:** Zoom in and out of the canvas.
*   **Undo/Redo:** Undo and redo your actions.
*   **Color Picker:** A color picker to select colors for drawing.
*   **Layer Management:** Support for multiple layers to organize your artwork.
*   **Animation Timeline:** A timeline to create animated pixel art.
*   **Theme Switching:** Switch between light and dark themes for a comfortable user experience.
*   **Improved Touch Handling:** Enhanced touch interactions for a smoother drawing experience on both native and web platforms.
*   **Web Compatibility:** Fixed rendering issues to ensure full functionality of the pixel art canvas in web browsers.

## Tech Stack

*   **React Native:** A framework for building native apps using React.
*   **Expo:** A platform for making universal React applications.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Redux-like State Management:** A predictable state container for JavaScript apps.
*   **React Native Paper:** A cross-platform UI component library for React Native.
*   **React Native Gesture Handler:** A library for handling touch gestures in React Native.
*   **React Native Reanimated:** A library for creating smooth animations in React Native.

## File Structure

```
├───.gitignore
├───app.json
├───App.tsx
├───package-lock.json
├───package.json
├───README.md
├───tsconfig.json
├───.expo\
├───.git\
├───assets\
│   ├───adaptive-icon.png
│   ├───favicon.png
│   ├───icon.png
│   └───splash-icon.png
├───components\
│   ├───AdvancedColorPicker.tsx
│   ├───AnimatedAppbarAction.tsx
│   ├───ColorPicker.tsx
│   ├───ColorPickerModal.tsx
│   ├───CustomTooltip.tsx
│   ├───LayerManager.tsx
│   ├───LeftToolbar.tsx
│   ├───Palette.tsx
│   ├───PixelArtEditor.styles.ts
│   ├───PixelArtEditor.tsx
│   ├───Preview.tsx
│   ├───RightSidebar.tsx
│   ├───SkiaCanvas.native.tsx
│   ├───SkiaCanvas.web.tsx
│   ├───Timeline.tsx
│   └───Toolbar.tsx
├───node_modules\
├───state\
│   ├───canvasReducer.ts
│   ├───constants.ts
│   ├───initialState.ts
│   ├───reducer.ts
│   ├───store.ts
│   ├───types.ts
│   └───utils.ts
└───theme\
    └───themes.ts
```

## Getting Started

1.  **Clone the repository:**
    ```
    git clone https://github.com/your-username/pixel-art-app.git
    ```
2.  **Install the dependencies:**
    ```
    npm install
    ```
3.  **Start the development server:**
    ```
    npm start
    ```

### Running on Android Device

1.  **Install Expo Go app:** Download and install the [Expo Go app](https://play.google.com/store/apps/details?id=host.exp.exponent) on your Android device.
2.  **Ensure device is on the same network:** Make sure your Android device is connected to the same Wi-Fi network as your computer.
3.  **Scan the QR code:** After running `npm start`, a QR code will appear in your terminal. Open the Expo Go app on your Android device and scan the QR code to open the app.

## State Management

The application uses a Redux-like state management pattern to manage its state. The state is stored in a single store, and it can only be updated by dispatching actions. The `state` directory contains all the necessary files for managing the state, including actions, constants, reducers, and the store.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have any suggestions or find any bugs.