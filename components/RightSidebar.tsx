import React from 'react';
import { View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { LayerManager } from './LayerManager';
import { ColorPicker } from './ColorPicker';
import { getStyles } from './PixelArtEditor.styles';
import type { Layer } from '../state/types';
import { Canvas } from './Canvas';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from '../state/constants';
import { Palette } from './Palette';

const PREVIEW_SIZE = 128;

const Preview: React.FC<{ layers: Layer[] }> = ({ layers }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const previewScale = Math.floor(PREVIEW_SIZE / Math.max(PIXEL_WIDTH, PIXEL_HEIGHT));
  const artboardWidth = PIXEL_WIDTH * previewScale;
  const artboardHeight = PIXEL_HEIGHT * previewScale;
  const panX = (PREVIEW_SIZE - artboardWidth) / 2;
  const panY = (PREVIEW_SIZE - artboardHeight) / 2;

  return (
    <View style={{ alignItems: 'center', marginBottom: 16 }}>
      <Text style={styles.sectionTitle}>Preview</Text>
      <Surface style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8, overflow: 'hidden' }}>
        <Canvas
          layers={layers}
          scale={previewScale}
          pan={{ x: panX, y: panY }}
          setPan={() => {}}
          onPixelPress={() => {}}
          showGrid={false}
          width={PREVIEW_SIZE}
          height={PREVIEW_SIZE}
          selectedTool=""
        />
      </Surface>
    </View>
  );
};

export const RightSidebar: React.FC<{ layers: Layer[] }> = ({ layers }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Surface style={styles.rightSidebar}>
      <Preview layers={layers} />
      <LayerManager />
      <ColorPicker />
      <Palette />
    </Surface>
  );
};
