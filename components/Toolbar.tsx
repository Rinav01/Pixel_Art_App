import React, { useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getStyles } from './PixelArtEditor.styles';
import type { EditorState } from '../state/types';
import { CustomTooltip } from './CustomTooltip';
import { ColorPickerModal } from './ColorPickerModal';

interface AnimatedIconButtonProps {
  icon: string;
  onPress: () => void;
  isSelected?: boolean;
  title: string;
}

const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({ icon, onPress, isSelected, title }) => {
  const selectionScale = React.useRef(new Animated.Value(1)).current;
  const hoverScale = React.useRef(new Animated.Value(1)).current;
  const theme = useTheme();

  React.useEffect(() => {
    Animated.spring(selectionScale, {
      toValue: isSelected ? 1.1 : 1,
      useNativeDriver: false,
      friction: 4,
    }).start();
  }, [isSelected]);

  const handleMouseEnter = () => {
    Animated.spring(hoverScale, {
      toValue: 1.2,
      useNativeDriver: false,
      friction: 4,
    }).start();
  };

  const handleMouseLeave = () => {
    Animated.spring(hoverScale, {
      toValue: 1,
      useNativeDriver: false,
      friction: 4,
    }).start();
  };

  const combinedScale = Animated.multiply(selectionScale, hoverScale);

  return (
    <CustomTooltip title={title}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Animated.View
          style={{ transform: [{ scale: combinedScale }] }}
        >
          <IconButton
            icon={icon}
            onPress={onPress}
            mode={isSelected ? 'contained' : 'outlined'}
            containerColor={isSelected ? theme.colors.primary : undefined}
            iconColor={isSelected ? theme.colors.onPrimary : theme.colors.onSurface}
          />
        </Animated.View>
      </div>
    </CustomTooltip>
  );
};

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onZoomIn, onZoomOut }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const tool = useSelector((s: EditorState) => s.tool);
  const color = useSelector((s: EditorState) => s.color);
  const [isColorPickerVisible, setColorPickerVisible] = React.useState(false);

  const handleToolChange = (newTool: string) => dispatch({ type: 'SET_TOOL', payload: newTool });

  return (
    <View style={styles.toolRow}>
      <AnimatedIconButton icon="pencil" title="Pen" onPress={() => handleToolChange('pen')} isSelected={tool === 'pen'} />
      <AnimatedIconButton icon="eraser" title="Eraser" onPress={() => handleToolChange('eraser')} isSelected={tool === 'eraser'} />
      <AnimatedIconButton icon="format-color-fill" title="Fill" onPress={() => handleToolChange('fill')} isSelected={tool === 'fill'} />
      <AnimatedIconButton icon="eyedropper" title="Eyedropper" onPress={() => handleToolChange('eyedropper')} isSelected={tool === 'eyedropper'} />
      <AnimatedIconButton icon="pan" title="Pan" onPress={() => handleToolChange('pan')} isSelected={tool === 'pan'} />
      <AnimatedIconButton icon="magnify-plus-outline" title="Zoom In" onPress={onZoomIn} />
      <AnimatedIconButton icon="magnify-minus-outline" title="Zoom Out" onPress={onZoomOut} />
      <View style={styles.divider} />
      <TouchableOpacity style={[styles.colorButton, { backgroundColor: color }]} onPress={() => setColorPickerVisible(true)} />
      <ColorPickerModal visible={isColorPickerVisible} onDismiss={() => setColorPickerVisible(false)} />
    </View>
  );
};
