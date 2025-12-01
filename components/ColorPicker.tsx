import React from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_PALETTE } from '../state/palettes';
import { styles } from './PixelArtEditor.styles';
import type { EditorState } from '../state/types';

export const ColorPicker: React.FC = () => {
  const dispatch = useDispatch();
  const color = useSelector((s: EditorState) => s.color);
  const [hex, setHex] = React.useState(color);

  const handleColorChange = (newColor: string) => {
    dispatch({ type: 'SET_COLOR', payload: newColor });
    setHex(newColor);
  };

  return (
    <View style={styles.colorPicker}>
      <Text variant="headlineSmall" style={styles.sectionTitle}>Palette</Text>
      <View style={styles.paletteRow}>
        {DEFAULT_PALETTE.map((c, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.paletteColor, { backgroundColor: c }, color === c && styles.selectedColor]}
            onPress={() => handleColorChange(c)}
          />
        ))}
      </View>
      <View style={{ paddingVertical: 8, flexDirection: 'row', alignItems: 'center' }}>
        <TextInput value={hex} onChangeText={setHex} style={{ flex: 1, color: '#fff', borderColor: '#555', borderWidth: 1, padding: 8, borderRadius: 6 }} placeholderTextColor="#999" />
        <Button onPress={() => handleColorChange(hex)} style={{ marginLeft: 8 }} mode="contained">Set</Button>
      </View>
    </View>
  );
};
