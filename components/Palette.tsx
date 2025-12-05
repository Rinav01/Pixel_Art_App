import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme, Text, IconButton, Button } from 'react-native-paper';
import type { EditorState } from '../state/types';
import { getStyles } from './PixelArtEditor.styles';

export const Palette: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const { palette, color: currentColor } = useSelector((s: EditorState) => ({
    palette: s.palette,
    color: s.color,
  }));

  const handleSetColor = (color: string) => {
    if (!isEditMode) {
      dispatch({ type: 'SET_COLOR', payload: color });
    }
  };

  const handleRemoveColor = (color: string) => {
    dispatch({ type: 'REMOVE_COLOR_FROM_PALETTE', payload: color });
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>Palette</Text>
        <Button onPress={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? 'Done' : 'Edit'}
        </Button>
      </View>
      <View style={styles.paletteRow}>
        {palette.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.paletteColor,
              { backgroundColor: color },
              color === currentColor && !isEditMode && styles.selectedColor,
            ]}
            onPress={() => handleSetColor(color)}
          >
            {isEditMode && (
              <IconButton
                icon="close"
                size={12}
                onPress={() => handleRemoveColor(color)}
                style={localStyles.deleteButton}
                iconColor={theme.colors.onErrorContainer}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
});
