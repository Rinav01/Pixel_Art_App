import React from 'react';
import { Canvas, Rect, Group, Line } from '@shopify/react-native-skia';
import type { Layer } from '../state/types';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from '../state/constants';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import type { GestureUpdateEvent, TapGestureHandlerEventPayload, PanGestureHandlerEventPayload, LongPressGestureHandlerEventPayload } from 'react-native-gesture-handler';

interface SkiaCanvasProps {
  layers: Layer[];
  scale: number;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
  showGrid: boolean;
  onPixelPress: (x: number, y:number) => void;
  width: number;
  height: number;
  selectedTool: string;
}

export const SkiaCanvas: React.FC<SkiaCanvasProps> = ({
  layers,
  scale,
  pan,
  setPan,
  showGrid,
  onPixelPress,
  width,
  height,
  selectedTool,
}) => {
  const artboardWidth = PIXEL_WIDTH * scale;
  const artboardHeight = PIXEL_HEIGHT * scale;

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .enabled(selectedTool === 'pan')
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      setPan({
        x: pan.x + e.translationX,
        y: pan.y + e.translationY,
      });
    });

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .enabled(selectedTool !== 'pan')
    .onStart((e: GestureUpdateEvent<TapGestureHandlerEventPayload>) => {
      const pixelX = Math.floor((e.x - pan.x) / scale);
      const pixelY = Math.floor((e.y - pan.y) / scale);
      onPixelPress(pixelX, pixelY);
    });

    const longPressGesture = Gesture.LongPress()
    .minDuration(50)
    .enabled(selectedTool !== 'pan')
    .onStart((e: GestureUpdateEvent<LongPressGestureHandlerEventPayload>) => {
      const pixelX = Math.floor((e.x - pan.x) / scale);
      const pixelY = Math.floor((e.y - pan.y) / scale);
      onPixelPress(pixelX, pixelY);
    });

  const gesture = Gesture.Race(panGesture, tapGesture, longPressGesture);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ width, height }}>
        <Group transform={[{ translateX: pan.x }, { translateY: pan.y }]}>
          {layers.map(layer =>
            layer.isVisible
              ? layer.pixels.map((row, y) =>
                  row.map((color, x) =>
                    color ? (
                      <Rect
                        key={`${layer.id}-${y}-${x}`}
                        x={x * scale}
                        y={y * scale}
                        width={scale}
                        height={scale}
                        color={color}
                      />
                    ) : null
                  )
                )
              : null
          )}
          {showGrid && (
            <Group>
              {Array.from({ length: PIXEL_WIDTH + 1 }).map((_, i) => (
                <Line
                  key={`v-${i}`}
                  p1={{ x: i * scale, y: 0 }}
                  p2={{ x: i * scale, y: artboardHeight }}
                  color="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                />
              ))}
              {Array.from({ length: PIXEL_HEIGHT + 1 }).map((_, i) => (
                <Line
                  key={`h-${i}`}
                  p1={{ x: 0, y: i * scale }}
                  p2={{ x: artboardWidth, y: i * scale }}
                  color="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                />
              ))}
            </Group>
          )}
        </Group>
      </Canvas>
    </GestureDetector>
  );
};
