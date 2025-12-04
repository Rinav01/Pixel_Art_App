import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './PixelArtEditor.styles';
import type { EditorState } from '../state/types';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onZoomIn, onZoomOut }) => {
  const dispatch = useDispatch();
  const tool = useSelector((s: EditorState) => s.tool);
  const color = useSelector((s: EditorState) => s.color);

  const handleToolChange = (newTool: string) => dispatch({ type: 'SET_TOOL', payload: newTool });

  return (
    <View style={styles.toolRow}>
      <IconButton icon="pencil" onPress={() => handleToolChange('pen')} mode={tool === 'pen' ? 'contained' : 'outlined'} />
      <IconButton icon="eraser" onPress={() => handleToolChange('eraser')} mode={tool === 'eraser' ? 'contained' : 'outlined'} />
      <IconButton icon="format-color-fill" onPress={() => handleToolChange('fill')} mode={tool === 'fill' ? 'contained' : 'outlined'} />
      <IconButton icon="eyedropper" onPress={() => handleToolChange('eyedropper')} mode={tool === 'eyedropper' ? 'contained' : 'outlined'} />
      <IconButton icon="pan" onPress={() => handleToolChange('pan')} mode={tool === 'pan' ? 'contained' : 'outlined'} />
      <IconButton icon="magnify-plus-outline" onPress={onZoomIn} />
      <IconButton icon="magnify-minus-outline" onPress={onZoomOut} />
      <View style={styles.divider} />
      <TouchableOpacity style={[styles.colorButton, { backgroundColor: color }]} onPress={() => { /* Open color picker modal or navigate */ }} />
    </View>
  );
};
