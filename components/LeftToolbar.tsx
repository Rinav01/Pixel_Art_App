import React from 'react';
import { Surface } from 'react-native-paper';
import { Toolbar } from './Toolbar';
import { styles } from './PixelArtEditor.styles';

interface LeftToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const LeftToolbar: React.FC<LeftToolbarProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <Surface style={styles.leftToolbar}>
      <Toolbar onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
    </Surface>
  );
};
