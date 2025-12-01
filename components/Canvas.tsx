import React from 'react';
import { View, PanResponder, LayoutChangeEvent } from 'react-native';
import Svg, { Rect, G, Line } from 'react-native-svg';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from '../state/constants';
import type { Layer } from '../state/types';

interface CanvasProps {
  layers: Layer[];
  scale: number;
  onPixelPress: (x: number, y: number) => void;
  pan: { x: number; y: number };
  setPan: (p: { x: number; y: number }) => void;
  showGrid: boolean;
  tool: string;
  color: string;
  width: number;
  height: number;
  panSensitivity?: number; // optional
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
  panSensitivity = 1,
}) => {
  // keep a stable ref to the latest onPixelPress to avoid stale closures
  const onPixelPressRef = React.useRef(onPixelPress);
  onPixelPressRef.current = onPixelPress;

  // refs to accumulate pan reliably across gestures
  const panOffsetRef = React.useRef({ ...pan });
  React.useEffect(() => {
    panOffsetRef.current = { ...pan };
  }, [pan]);

  const containerRef = React.useRef<View>(null);
  const svgOffsetRef = React.useRef({ x: 0, y: 0 });
  const onContainerLayout = () => {
    containerRef.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
        if (pageX !== undefined && pageY !== undefined) {
            svgOffsetRef.current = { x: pageX, y: pageY };
        }
    });
  };

  // set initial centered pan if parent passed a zero pan (common pattern)
  React.useEffect(() => {
    // only set initial center if parent pan is exactly 0,0
    if ((pan.x === 0 && pan.y === 0) && width > 0 && height > 0) {
      const artboardW = PIXEL_WIDTH * scale;
      const artboardH = PIXEL_HEIGHT * scale;
      const centeredPan = {
        x: Math.round((width - artboardW) / 2),
        y: Math.round((height - artboardH) / 2),
      };
      setPan(centeredPan);
      panOffsetRef.current = centeredPan;
    }
    // we only want to run this on mount / when dimensions become available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, scale]);
  
  const panStartRef = React.useRef({ x: 0, y: 0 });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        panStartRef.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
      },
      onPanResponderMove: (_evt, gestureState) => {
        const newPan = {
          x: panOffsetRef.current.x + gestureState.dx * panSensitivity,
          y: panOffsetRef.current.y + gestureState.dy * panSensitivity,
        };
        setPan(newPan);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // treat small movement as tap (threshold = 6)
        const isTap = Math.abs(gestureState.dx) < 6 && Math.abs(gestureState.dy) < 6;

        // accumulate pan
        const newPan = {
          x: panOffsetRef.current.x + gestureState.dx * panSensitivity,
          y: panOffsetRef.current.y + gestureState.dy * panSensitivity,
        };
        panOffsetRef.current = newPan;
        setPan(newPan);

        if (isTap) {
          // Use pageX/pageY so it's consistent across platforms and with nested layouts
          const pageX = evt.nativeEvent.pageX;
          const pageY = evt.nativeEvent.pageY;

          // Convert screen coords to local SVG coords:
          // local = page - svgOffset - currentPan
          const svgOffset = svgOffsetRef.current;
          const localX = pageX - svgOffset.x - panOffsetRef.current.x;
          const localY = pageY - svgOffset.y - panOffsetRef.current.y;

          const pixelX = Math.floor(localX / scale);
          const pixelY = Math.floor(localY / scale);

          // bounds guard
          if (pixelX >= 0 && pixelX < PIXEL_WIDTH && pixelY >= 0 && pixelY < PIXEL_HEIGHT) {
            onPixelPressRef.current(pixelX, pixelY);
          }
        }
      },
    })
  ).current;

  // build pixel rects (only visible pixels)
  const rects = React.useMemo(() => {
    const list: any[] = [];
    // iterate layers bottom-to-top (or top-to-bottom depending on desired stacking)
    for (let li = 0; li < layers.length; li++) {
      const layer = layers[li];
      if (!layer.isVisible) continue;
      for (let y = 0; y < layer.pixels.length; y++) {
        for (let x = 0; x < layer.pixels[y].length; x++) {
          const color = layer.pixels[y][x];
          if (color) {
            list.push(
              <Rect
                key={`p-${li}-${x}-${y}`}
                x={pan.x + x * scale}
                y={pan.y + y * scale}
                width={scale}
                height={scale}
                fill={color}
              />
            );
          }
        }
      }
    }
    return list;
  }, [layers, pan.x, pan.y, scale]);

  const grid = React.useMemo(() => {
    if (!showGrid || scale < 4) return null;
    const lines: any[] = [];
    const widthPx = PIXEL_WIDTH * scale;
    const heightPx = PIXEL_HEIGHT * scale;

    // Vertical grid lines
    for (let gx = 0; gx <= PIXEL_WIDTH; gx++) {
      const xPos = pan.x + gx * scale;
      // optional: skip lines far outside viewport for performance
      lines.push(
        <Line
          key={`v-${gx}`}
          x1={xPos}
          y1={pan.y}
          x2={xPos}
          y2={pan.y + heightPx}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={1}
        />
      );
    }

    // Horizontal grid lines
    for (let gy = 0; gy <= PIXEL_HEIGHT; gy++) {
      const yPos = pan.y + gy * scale;
      lines.push(
        <Line
          key={`h-${gy}`}
          x1={pan.x}
          y1={yPos}
          x2={pan.x + widthPx}
          y2={yPos}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={1}
        />
      );
    }

    return lines;
  }, [showGrid, scale, pan.x, pan.y]);

  return (
    <View
      ref={containerRef}
      style={{ flex: 1 }}
      onLayout={onContainerLayout}
      {...panResponder.panHandlers}
      // ensure the container has the requested width/height when provided by parent
      // if the parent passes width/height we use them for the SVG itself; the View will
      // generally flex, so we do not force size here.
    >
      <Svg width={width} height={height}>
        {/* artboard background - single rect for performance */}
        <G>
          <Rect
            x={pan.x}
            y={pan.y}
            width={PIXEL_WIDTH * scale}
            height={PIXEL_HEIGHT * scale}
            fill="#ffffff"
            stroke="#e0e0e0"
            strokeWidth={1}
            rx={2}
          />
        </G>

        {/* pixel rectangles */}
        <G>{rects}</G>

        {/* grid lines */}
        <G>{grid}</G>
      </Svg>
    </View>
  );
};
