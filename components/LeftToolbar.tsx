import React from 'react';
import { Surface } from 'react-native-paper';
import { Toolbar } from './Toolbar';
import { styles } from './PixelArtEditor.styles';

export const LeftToolbar: React.FC = () => {
  return (
    <Surface style={styles.leftToolbar}>
      <Toolbar />
    </Surface>
  );
};
