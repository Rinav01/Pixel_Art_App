import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import type { EditorState } from '../state/types';

import { Timeline } from './Timeline';
import { LeftToolbar } from './LeftToolbar';
import { RightSidebar } from './RightSidebar';
import { getStyles } from './PixelArtEditor.styles';
import { PIXEL_HEIGHT, PIXEL_WIDTH } from '../state/constants';
import { AnimatedAppbarAction } from './AnimatedAppbarAction';
// @ts-ignore
import { SkiaCanvas } from './SkiaCanvas';

interface PixelArtEditorProps {
  isDarkMode: boolean;
  setIsDarkMode: () => void;
}

const PixelArtEditor: React.FC<PixelArtEditorProps> = ({ isDarkMode, setIsDarkMode }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  
  const frames = useSelector((s: EditorState) => s.frames);
  const currentFrame = useSelector((s: EditorState) => s.currentFrame);
  const currentLayer = useSelector((s: EditorState) => s.currentLayer);
  const color = useSelector((s: EditorState) => s.color);
  const tool = useSelector((s: EditorState) => s.tool);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [scale, setScale] = React.useState(1);
  const [showGrid, setShowGrid] = React.useState(true);
  
  // Constants for layout
  const LEFT_TOOLBAR_WIDTH = 64;
  const RIGHT_SIDEBAR_WIDTH = 280;
  const HEADER_HEIGHT = 56; // Approximate Appbar height
  const TIMELINE_HEIGHT = 80;
  
  // Calculate available canvas area
  const canvasWidth = Math.max(0, windowWidth - LEFT_TOOLBAR_WIDTH - RIGHT_SIDEBAR_WIDTH);
  const canvasHeight = Math.max(0, windowHeight - HEADER_HEIGHT - TIMELINE_HEIGHT);
  
  React.useEffect(() => {
    // Calculate scale to fit canvas with some padding
    const padding = 40;
    const availableWidth = canvasWidth - padding;
    const availableHeight = canvasHeight - padding;
    
    const scaleX = availableWidth / PIXEL_WIDTH;
    const scaleY = availableHeight / PIXEL_HEIGHT;
    const newScale = Math.floor(Math.min(scaleX, scaleY));
    
    setScale(Math.max(1, newScale)); // Ensure minimum scale of 1
    
    // Center the canvas
    const artboardWidth = PIXEL_WIDTH * newScale;
    const artboardHeight = PIXEL_HEIGHT * newScale;
    const newPanX = (canvasWidth - artboardWidth) / 2;
    const newPanY = (canvasHeight - artboardHeight) / 2;
    setPan({ x: newPanX, y: newPanY });
  }, [windowWidth, windowHeight, canvasWidth, canvasHeight]);

  const handlePixelPress = (x: number, y: number) => {
    if (x < 0 || y < 0) return;
    if (x >= PIXEL_WIDTH || y >= PIXEL_HEIGHT) return;
    if (tool === 'pen') {
      dispatch({ type: 'DRAW_PIXEL', payload: { frameIndex: currentFrame, layerId: currentLayer, x, y, color } });
    } else if (tool === 'eraser') {
      dispatch({ type: 'DRAW_PIXEL', payload: { frameIndex: currentFrame, layerId: currentLayer, x, y, color: null } });
    } else if (tool === 'fill') {
      dispatch({ type: 'FILL', payload: { frameIndex: currentFrame, layerId: currentLayer, x, y, color } });
    } else if (tool === 'eyedropper') {
      // sample top-most visible layer at x,y
      const layers = frames[currentFrame].layers;
      for (let i = layers.length - 1; i >= 0; i--) {
        const l = layers[i];
        if (!l.isVisible) continue;
        const c = l.pixels[y]?.[x];
        if (c) {
          dispatch({ type: 'SET_COLOR', payload: c });
          break;
        }
      }
    }
  };

  const handleDeleteFrame = (id: string) => {
    const frameIndex = frames.findIndex(f => f.id === id);
    if (frameIndex === -1) return;
    dispatch({ type: 'DELETE_FRAME', payload: { frameIndex } });
    dispatch({ type: 'SET_CURRENT_FRAME', payload:  Math.max(0, currentFrame - 1) });
  };

  const handleAddFrame = () => {
    dispatch({ type: 'ADD_FRAME' });
    dispatch({ type: 'SET_CURRENT_FRAME', payload: frames.length });
  };

  const handleZoomIn = () => setScale(s => s + 1);
  const handleZoomOut = () => setScale(s => Math.max(1, s - 1));

  // const handleUndo = () => {
  //   // Implement undo logic
  // };

  // const handleRedo = () => {
  //   // Implement redo logic
  // };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Pixel Art Editor" />
        <AnimatedAppbarAction icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'} onPress={setIsDarkMode} />
        <AnimatedAppbarAction icon="grid" onPress={() => setShowGrid(s => !s)} color={showGrid ? theme.colors.primary : undefined} />
        {/* <AnimatedAppbarAction icon="undo" onPress={handleUndo} /> */}
        {/* <AnimatedAppbarAction icon="redo" onPress={handleRedo} /> */}
        <AnimatedAppbarAction icon="download" onPress={() => { /* Implement download */ }} />
      </Appbar.Header>

      <View style={styles.mainArea}>
        <LeftToolbar onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        <View style={styles.canvasContainer}>
          <SkiaCanvas
            layers={frames[currentFrame].layers}
            scale={scale}
            pan={pan}
            setPan={setPan}
            onPixelPress={handlePixelPress}
            showGrid={showGrid}
            selectedTool={tool}
            width={canvasWidth}
            height={canvasHeight}
          />
        </View>
        <RightSidebar
          layers={frames[currentFrame].layers}
          currentLayer={currentLayer}
          currentFrame={currentFrame}
          dispatch={dispatch}
          selectedTool={tool}
        />
      </View>

      <Timeline
          frames={frames}
          currentFrame={currentFrame}
          onAddFrame={handleAddFrame}
          onSetCurrentFrame={(i) => dispatch({ type: 'SET_CURRENT_FRAME', payload: i })}
          onDeleteFrame={handleDeleteFrame}
      />
    </View>
  );
};

export default PixelArtEditor;