import React from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PixelArtEditor from './components/PixelArtEditor';
import { store } from './state/store';
import { lightTheme, darkTheme } from './theme/themes';
import "react-native-gesture-handler";
import { LayoutAnimation, UIManager, Platform } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <PixelArtEditor isDarkMode={isDarkMode} setIsDarkMode={toggleTheme} />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}