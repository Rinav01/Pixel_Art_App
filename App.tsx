import React from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import PixelArtEditor from './components/PixelArtEditor';
import { store } from './state/store';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <PixelArtEditor />
      </PaperProvider>
    </Provider>
  );
}