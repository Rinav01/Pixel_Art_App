import React from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PixelArtEditor from './components/PixelArtEditor';
import { store } from './state/store';
import "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <PixelArtEditor />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}