import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { getStyles } from './PixelArtEditor.styles';
import { AdvancedColorPicker } from './AdvancedColorPicker';
import type { EditorState } from '../state/types';

export const ColorPicker: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const color = useSelector((s: EditorState) => s.color);
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.colorButton, { backgroundColor: color, alignSelf: 'center' }]}
        onPress={() => setModalVisible(true)}
      />
      {modalVisible && (
        <AdvancedColorPicker
          onDismiss={() => setModalVisible(false)}
        />
      )}
    </>
  );
};

