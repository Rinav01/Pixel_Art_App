import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';
import { DEFAULT_PALETTE } from '../state/palettes';
import { styles } from './PixelArtEditor.styles';

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ color, onColorChange }: ColorPickerProps) {
  return (
    <Surface style={styles.colorPicker}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.paletteRow}>
          {DEFAULT_PALETTE.map((c, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.paletteColor,
                { backgroundColor: c },
                color === c && styles.selectedColor,
              ]}
              onPress={() => onColorChange(c)}
            />
          ))}
        </View>
      </ScrollView>
    </Surface>
  );
}
