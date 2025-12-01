import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  Surface,
  IconButton,
  Text,
  Chip,
  Portal,
  Modal,
  Button,
  FAB,
  useTheme,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { EditorState } from '../state/types';
import { LayerManager } from './LayerManager';
import { styles } from './PixelArtEditor.styles';
import { Canvas } from './Canvas';
import { Timeline } from './Timeline';

import { Toolbar } from './Toolbar';
import { ColorPicker } from './ColorPicker';

function PixelArtEditor() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    frames,
    currentFrame,
    currentLayer,
    color,
    tool,
  } = useSelector((state: EditorState) => state);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(10);
  const [showGrid, setShowGrid] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handlePixelPress = (x: number, y: number) => {
    if (tool === 'pen') {
      dispatch({ type: 'DRAW_PIXEL', payload: { x, y } });
    }
  };

  const handlePan = (dx: number, dy: number) => {
    if (tool === 'pan') {
      setPan({ x: pan.x + dx, y: pan.y + dy });
    }
  };

  const handleToolChange = (newTool: string) => {
    dispatch({ type: 'SET_TOOL', payload: newTool });
  };

  const handleColorChange = (newColor: string) => {
    dispatch({ type: 'SET_COLOR', payload: newColor });
    setShowColorPicker(false);
  };

  const [showLayerManager, setShowLayerManager] = useState(false);

  const handleAddLayer = () => {
    dispatch({ type: 'ADD_LAYER' });
  };

  const handleDeleteLayer = (id: string) => {
    dispatch({ type: 'DELETE_LAYER', payload: id });
  };

  const handleToggleLayerVisibility = (id: string) => {
    dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: id });
  };

  const handleSetCurrentLayer = (id: string) => {
    dispatch({ type: 'SET_CURRENT_LAYER', payload: id });
  };

  const handleSetCurrentFrame = (index: number) => {
    dispatch({ type: 'SET_CURRENT_FRAME', payload: index });
  };

  const handleAddFrame = () => {
    dispatch({ type: 'ADD_FRAME' });
  };


  return (
    <View style={styles.container}>
      {/* Top Toolbar */}
      <Appbar.Header>
        <Appbar.Content title="Pixel Art Editor" />
        <Appbar.Action
          icon="grid"
          onPress={() => setShowGrid(!showGrid)}
          color={showGrid ? theme.colors.primary : undefined}
        />
        <Appbar.Action icon="layers" onPress={() => setShowLayerManager(true)} />
      </Appbar.Header>

      {/* Tool Bar */}
      <Toolbar
        tool={tool}
        color={color}
        scale={scale}
        onToolChange={handleToolChange}
        onScaleChange={setScale}
        onColorChange={() => setShowColorPicker(!showColorPicker)}
      />

      {/* Color Picker */}
      {showColorPicker && (
        <ColorPicker color={color} onColorChange={handleColorChange} />
      )}

      {/* Canvas */}
      <Canvas
        layers={frames[currentFrame].layers}
        scale={scale}
        pan={pan}
        showGrid={showGrid}
        onPixelPress={handlePixelPress}
        onPan={handlePan}
      />

      {/* Frame Timeline */}
      <Timeline
        frames={frames}
        currentFrame={currentFrame}
        onAddFrame={handleAddFrame}
        onSetCurrentFrame={handleSetCurrentFrame}
      />

      {/* Layer Modal */}
      <LayerManager
        visible={showLayerManager}
        layers={frames[currentFrame].layers}
        currentLayer={currentLayer}
        onDismiss={() => setShowLayerManager(false)}
        onAddLayer={handleAddLayer}
        onDeleteLayer={handleDeleteLayer}
        onToggleLayerVisibility={handleToggleLayerVisibility}
        onSetCurrentLayer={handleSetCurrentLayer}
      />

      {/* Brush Size FAB */}
      <FAB.Group
        open={isFabOpen}
        visible
        icon="brush"
        actions={[
          {
            icon: 'numeric-1',
            label: '1px',
            onPress: () => {},
          },
          {
            icon: 'numeric-2',
            label: '2px',
            onPress: () => {},
          },
          {
            icon: 'numeric-3',
            label: '3px',
            onPress: () => {},
          },
        ]}
        onStateChange={() => setIsFabOpen(!isFabOpen)}
        style={styles.fab}
      />
    </View>
  );
}

export default PixelArtEditor;
