import React from 'react';
import { View, PanResponder } from 'react-native';
import Svg, { Rect, G, Line } from 'react-native-svg';
import { useTheme } from 'react-native-paper';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from '../state/constants';
import type { Layer } from '../state/types';

type Point = { x: number; y: number };

interface CanvasProps {
  layers: Layer[];
  scale: number;
  onPixelPress: (x: number, y: number) => void;
  pan: Point;
  setPan: (p: Point) => void;
  showGrid: boolean;
  width: number;
  height: number;
  selectedTool: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  layers,
  scale,
  onPixelPress,
  pan,
  setPan,
  showGrid,
  width,
  height,
  selectedTool,
}) => {
  const theme = useTheme();
  const onPixelPressRef = React.useRef(onPixelPress);
  onPixelPressRef.current = onPixelPress;

  const selectedToolRef = React.useRef(selectedTool);
  React.useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  const panRef = React.useRef(pan);
  React.useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  const scaleRef = React.useRef(scale);
  React.useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  const containerRef = React.useRef<View>(null);
  const svgOffsetRef = React.useRef({ x: 0, y: 0 });
  const onContainerLayout = () => {
    containerRef.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
      if (pageX !== undefined && pageY !== undefined) {
        svgOffsetRef.current = { x: pageX, y: pageY };
      }
    });
  };
  const panOffsetRef = React.useRef({ x: 0, y: 0 });

  // Initialize centered pan
  React.useEffect(() => {
    if (pan.x === 0 && pan.y === 0 && width > 0 && height > 0) {
      const artboardW = PIXEL_WIDTH * scale;
      const artboardH = PIXEL_HEIGHT * scale;
      const centeredPan = {
        x: Math.round((width - artboardW) / 2),
        y: Math.round((height - artboardH) / 2),
      };
      setPan(centeredPan);
      panOffsetRef.current = centeredPan;
    }
  }, [width, height, scale, setPan]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('onPanResponderGrant, selectedTool:', selectedToolRef.current);
        panOffsetRef.current = { ...panRef.current };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (selectedToolRef.current === 'pan') {
          console.log('panning', gestureState.dx, gestureState.dy);
          const newPan = {
            x: panOffsetRef.current.x + gestureState.dx,
            y: panOffsetRef.current.y + gestureState.dy,
          };
          setPan(newPan);
        } else {
          const pageX = evt.nativeEvent.pageX;
          const pageY = evt.nativeEvent.pageY;

          const svgOffset = svgOffsetRef.current;
          const localX = pageX - svgOffset.x - panRef.current.x;
          const localY = pageY - svgOffset.y - panRef.current.y;

          const pixelX = Math.floor(localX / scaleRef.current);
          const pixelY = Math.floor(localY / scaleRef.current);

          if (pixelX >= 0 && pixelX < PIXEL_WIDTH && pixelY >= 0 && pixelY < PIXEL_HEIGHT) {
            onPixelPressRef.current(pixelX, pixelY);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const isTap = Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;

        if (isTap && selectedToolRef.current !== 'pan') {
          const pageX = evt.nativeEvent.pageX;
          const pageY = evt.nativeEvent.pageY;

          const svgOffset = svgOffsetRef.current;
          const localX = pageX - svgOffset.x - panRef.current.x;
          const localY = pageY - svgOffset.y - panRef.current.y;

          const pixelX = Math.floor(localX / scaleRef.current);
          const pixelY = Math.floor(localY / scaleRef.current);

          if (pixelX >= 0 && pixelX < PIXEL_WIDTH && pixelY >= 0 && pixelY < PIXEL_HEIGHT) {
            onPixelPressRef.current(pixelX, pixelY);
          }
        }
      },
    })
  ).current;

  const rects = React.useMemo(() => {
    const list = [];
    for (let li = 0; li < layers.length; li++) {
      const layer = layers[li];
      if (!layer.isVisible) continue;
      for (let y = 0; y < layer.pixels.length; y++) {
        for (let x = 0; x < layer.pixels[y].length; x++) {
          const color = layer.pixels[y][x];
          if (color) {
            const px = pan.x + x * scale;
            const py = pan.y + y * scale;
            list.push(
              <Rect key={`p-${li}-${x}-${y}`} x={px} y={py} width={scale} height={scale} fill={color} />
            );
          }
        }
      }
    }
    return list;
  }, [layers, pan.x, pan.y, scale]);

  const grid = React.useMemo(() => {
    if (!showGrid || scale < 4) return null;
    const lines = [];
    const widthPx = PIXEL_WIDTH * scale;
    const heightPx = PIXEL_HEIGHT * scale;
    const baseX = pan.x;
    const baseY = pan.y;

    for (let gx = 0; gx <= PIXEL_WIDTH; gx++) {
      const xPos = baseX + gx * scale;
      lines.push(<Line key={`v-${gx}`} x1={xPos} y1={baseY} x2={xPos} y2={baseY + heightPx} stroke={theme.colors.outline} strokeWidth={0.5} />);
    }
    for (let gy = 0; gy <= PIXEL_HEIGHT; gy++) {
      const yPos = baseY + gy * scale;
      lines.push(<Line key={`h-${gy}`} x1={baseX} y1={yPos} x2={baseX + widthPx} y2={yPos} stroke={theme.colors.outline} strokeWidth={0.5} />);
    }

    return lines;
  }, [showGrid, scale, pan.x, pan.y, theme.colors.outline]);

  return (
    <View ref={containerRef} style={{ flex: 1 }} onLayout={onContainerLayout} {...panResponder.panHandlers}>
      <Svg width={width} height={height}>
        <G>
          <Rect
            x={pan.x}
            y={pan.y}
            width={PIXEL_WIDTH * scale}
            height={PIXEL_HEIGHT * scale}
            fill={theme.colors.onBackground}
            stroke={theme.colors.outline}
            strokeWidth={1}
            rx={2}
          />
        </G>

        <G>{rects}</G>
        <G>{grid}</G>
      </Svg>
    </View>
  );
};

export default Canvas;
