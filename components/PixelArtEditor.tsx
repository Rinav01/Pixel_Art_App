import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Appbar, FAB, Provider, Surface, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import type { EditorState } from '../state/types';
import { Canvas } from './Canvas';
import { Timeline } from './Timeline';
import { LeftToolbar } from './LeftToolbar';
import { RightSidebar } from './RightSidebar';
import { styles } from './PixelArtEditor.styles';
import { PIXEL_HEIGHT, PIXEL_WIDTH } from '../state/constants';

const PixelArtEditor: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { frames, currentFrame, currentLayer, color, tool } = useSelector((s: EditorState) => s);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Calculate the best scale and pan to fit the canvas on the screen
  const canvasWidth = PIXEL_WIDTH;
  const canvasHeight = PIXEL_HEIGHT;
  
  // Give some padding
  const availableWidth = windowWidth - 384; // 64 for left, 280 for right, 40 for padding
  const availableHeight = windowHeight - 160; // Account for header, timeline
  
  const scaleX = availableWidth / canvasWidth;
  const scaleY = availableHeight / canvasHeight;
  const initialScale = Math.floor(Math.min(scaleX, scaleY));
  
  const initialPanX = (windowWidth - (canvasWidth * initialScale)) / 2;
  const initialPanY = (windowHeight - (canvasHeight * initialScale)) / 2;
  
  const [pan, setPan] = React.useState({ x: initialPanX, y: initialPanY });
  const [scale, setScale] = React.useState(initialScale);
  const [showGrid, setShowGrid] = React.useState(true);
  const [isFabOpen, setIsFabOpen] = React.useState(false);
  
  React.useEffect(() => {
    const newScale = Math.floor(Math.min((windowWidth - 384) / canvasWidth, (windowHeight - 160) / canvasHeight));
    const newPanX = (windowWidth - (canvasWidth * newScale)) / 2;
    const newPanY = (windowHeight - (canvasHeight * newScale)) / 2;
    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  }, [windowWidth, windowHeight]);

  const handlePixelPress = (x: number, y: number) => {
    if (x < 0 || y < 0) return;
    if (x >= 32 || y >= 32) return;
    if (tool === 'pen') {
      dispatch({ type: 'DRAW_PIXEL', payload: { x, y, color, tool: 'pen' } });
    } else if (tool === 'eraser') {
      dispatch({ type: 'DRAW_PIXEL', payload: { x, y, tool: 'eraser' } });
    } else if (tool === 'fill') {
      dispatch({ type: 'FILL', payload: { x, y, color } });
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

  const handleUndo = () => dispatch({ type: 'UNDO' });
  const handleRedo = () => dispatch({ type: 'REDO' });

  return (
    <Provider theme={theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Pixel Art Editor" />
          <Appbar.Action icon="grid" onPress={() => setShowGrid(s => !s)} color={showGrid ? theme.colors.primary : undefined} />
          <Appbar.Action icon="undo" onPress={handleUndo} />
          <Appbar.Action icon="redo" onPress={handleRedo} />
          <Appbar.Action icon="download" onPress={() => { /* Implement download */ }} />
        </Appbar.Header>

        <View style={styles.mainArea}>
          <LeftToolbar />
          <View style={styles.canvasContainer}>
            <Canvas
              layers={frames[currentFrame].layers}
              scale={scale}
              pan={pan}
              setPan={setPan}
              onPixelPress={handlePixelPress}
              showGrid={showGrid}
              tool={tool}
              color={color}
              width={windowWidth - 344}
              height={windowHeight - 160}
            />
          </View>
          <RightSidebar />
        </View>

        <Timeline
            frames={frames}
            currentFrame={currentFrame}
            onAddFrame={() => dispatch({ type: 'ADD_FRAME' })}
            onSetCurrentFrame={(i) => dispatch({ type: 'SET_CURRENT_FRAME', payload: i })}
        />

        <FAB.Group
          open={isFabOpen}
          visible
          icon="brush"
          actions={[
            { icon: 'numeric-1', label: '1px', onPress: () => {/* add brush size logic later */} },
            { icon: 'numeric-2', label: '2px', onPress: () => {} },
            { icon: 'numeric-3', label: '3px', onPress: () => {} },
          ]}
          onStateChange={() => setIsFabOpen(s => !s)}
          style={styles.fab}
        />
      </View>
    </Provider>
  );
};

export default PixelArtEditor;
