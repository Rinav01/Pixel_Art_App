import React from 'react';
import { View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import type { Layer } from '../state/types';

import { PIXEL_WIDTH, PIXEL_HEIGHT } from '../state/constants';
import { getStyles } from './PixelArtEditor.styles';
// @ts-ignore
import { SkiaCanvas } from './SkiaCanvas';

const PREVIEW_SIZE = 128;

interface PreviewProps {
  layers: Layer[];
  selectedTool: string;
}

export const Preview: React.FC<PreviewProps> = ({ layers, selectedTool }) => {
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
      <Surface style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE, backgroundColor: '#FFFFFF', borderRadius: 8, overflow: 'hidden' }}>
        <SkiaCanvas
          layers={layers}
          scale={previewScale}
          pan={{ x: panX, y: panY }}
          setPan={() => {}}
          onPixelPress={() => {}}
          showGrid={false}
          width={PREVIEW_SIZE}
          height={PREVIEW_SIZE}
          selectedTool={selectedTool}
        />
      </Surface>
    </View>
  );
};
