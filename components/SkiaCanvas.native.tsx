import React, { useMemo, useRef } from 'react';
import { Canvas, Group, Line, Path, Skia } from '@shopify/react-native-skia';
import type { Layer } from '../state/types';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from '../state/constants';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import type { GestureUpdateEvent, TapGestureHandlerEventPayload, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

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
  const lastDrawnPixel = useRef<{x: number, y: number} | null>(null);

  // Optimization: Group pixels by color into Paths.
  // We create paths in "pixel space" (1x1) and scale the group.
  const layerPaths = useMemo(() => {
    return layers.map(layer => {
      if (!layer.isVisible) return null;
      const pathsByColor = new Map<string, ReturnType<typeof Skia.Path.Make>>();
      
      layer.pixels.forEach((row, y) => {
        row.forEach((color, x) => {
          if (!color) return;
          if (!pathsByColor.has(color)) {
            const p = Skia.Path.Make();
            pathsByColor.set(color, p);
          }
          // Add a 1x1 rect at x,y
          pathsByColor.get(color)!.addRect({ x, y, width: 1, height: 1 });
        });
      });
      
      return {
        id: layer.id,
        opacity: layer.opacity ?? 1,
        paths: Array.from(pathsByColor.entries()).map(([color, path]) => ({ color, path }))
      };
    });
  }, [layers]);

  // Pan Gesture for Viewport Panning (Two fingers or specific tool)
  const viewPanGesture = Gesture.Pan()
    .maxPointers(1) // Single finger pan if tool is selected
    .enabled(selectedTool === 'pan')
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      setPan({
        x: pan.x + e.translationX,
        y: pan.y + e.translationY,
      });
    });

  // Pan Gesture for Drawing (Drag to Draw)
  const drawGesture = Gesture.Pan()
    .maxPointers(1)
    .enabled(selectedTool !== 'pan')
    .onStart((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
       const pixelX = Math.floor((e.x - pan.x) / scale);
       const pixelY = Math.floor((e.y - pan.y) / scale);
       lastDrawnPixel.current = { x: pixelX, y: pixelY };
       onPixelPress(pixelX, pixelY);
    })
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      const pixelX = Math.floor((e.x - pan.x) / scale);
      const pixelY = Math.floor((e.y - pan.y) / scale);
      
      // Debounce: Only draw if we moved to a new pixel
      if (lastDrawnPixel.current?.x !== pixelX || lastDrawnPixel.current?.y !== pixelY) {
         lastDrawnPixel.current = { x: pixelX, y: pixelY };
         onPixelPress(pixelX, pixelY);
      }
    })
    .onEnd(() => {
      lastDrawnPixel.current = null;
    });

  // Tap Gesture (for single clicks)
  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .enabled(selectedTool !== 'pan')
    .onStart((e: GestureUpdateEvent<TapGestureHandlerEventPayload>) => {
      const pixelX = Math.floor((e.x - pan.x) / scale);
      const pixelY = Math.floor((e.y - pan.y) / scale);
      onPixelPress(pixelX, pixelY);
    });

  const gesture = Gesture.Race(viewPanGesture, drawGesture, tapGesture);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ width, height }}>
        <Group transform={[{ translateX: pan.x }, { translateY: pan.y }, { scale }]}>
          {layerPaths.map(layer => 
            layer ? (
              <Group key={layer.id} opacity={layer.opacity}>
                {layer.paths.map((p, i) => (
                  <Path key={i} path={p.path} color={p.color} />
                ))}
              </Group>
            ) : null
          )}
          
           {/* Grid is drawn in a separate group to handle the scale/strokeWidth correctly
               or we can just draw it scaled. 
               If we scale the grid, the stroke width scales too (becomes huge). 
               So we should draw the grid in screen space or inverse scale the stroke.
               Let's draw grid in "artboard space" but with vector-effect: non-scaling-stroke logic?
               Skia doesn't support 'non-scaling-stroke' easily in Group transform.
               So we separate the Grid out of the scaled Group or use 1/scale stroke width.
           */}
        </Group>
        
        {showGrid && (
           <Group transform={[{ translateX: pan.x }, { translateY: pan.y }]}>
              {/* Vertical Lines */}
              {Array.from({ length: PIXEL_WIDTH + 1 }).map((_, i) => (
                <Line
                  key={`v-${i}`}
                  p1={{ x: i * scale, y: 0 }}
                  p2={{ x: i * scale, y: artboardHeight }}
                  color="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                />
              ))}
              {/* Horizontal Lines */}
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
      </Canvas>
    </GestureDetector>
  );
};
