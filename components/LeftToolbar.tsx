import React from 'react';
import { Surface, useTheme } from 'react-native-paper';
import { Toolbar } from './Toolbar';
import { getStyles } from './PixelArtEditor.styles';

interface LeftToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const LeftToolbar: React.FC<LeftToolbarProps> = ({ onZoomIn, onZoomOut }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Surface style={styles.leftToolbar}>
      <Toolbar onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
    </Surface>
  );
};
