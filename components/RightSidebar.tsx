import React from 'react';
import { View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { LayerManager } from './LayerManager';
import { ColorPicker } from './ColorPicker';
import { styles } from './PixelArtEditor.styles';

const Preview = () => (
  <View style={{ alignItems: 'center', marginBottom: 16 }}>
    <Text style={styles.sectionTitle}>Preview</Text>
    <Surface style={{ width: 128, height: 128, backgroundColor: '#333', borderRadius: 8 }} />
  </View>
);

export const RightSidebar: React.FC = () => {
  return (
    <Surface style={styles.rightSidebar}>
      <Preview />
      <LayerManager />
      <ColorPicker />
    </Surface>
  );
};
