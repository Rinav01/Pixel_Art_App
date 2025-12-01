import React, { useRef } from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Svg, { Rect, G, Line } from 'react-native-svg';
import { Layer } from '../state/types';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from '../state/constants';
import { JSX } from 'react/jsx-runtime';

interface CanvasProps {
  layers: Layer[];
  scale: number;
  onPixelPress: (x: number, y: number) => void;
  onPan: (dx: number, dy: number) => void;
  pan: { x: number; y: number };
  showGrid: boolean;
}

export function Canvas({ layers, scale, onPixelPress, onPan, pan, showGrid }: CanvasProps) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const x = Math.floor((locationX - pan.x) / scale);
        const y = Math.floor((locationY - pan.y) / scale);
        onPixelPress(x, y);
      },
      onPanResponderMove: (evt, gestureState) => {
        onPan(gestureState.dx, gestureState.dy);
      },
    })
  ).current;

  const renderPixels = () => {
    const rects: JSX.Element[] = [];
    layers.forEach((layer, layerIdx) => {
      if (!layer.isVisible) return;
      layer.pixels.forEach((row, y) => {
        row.forEach((pixelColor, x) => {
          if (pixelColor) {
            rects.push(
              <Rect
                key={`${layerIdx}-${y}-${x}`}
                x={pan.x + x * scale}
                y={pan.y + y * scale}
                width={scale}
                height={scale}
                fill={pixelColor.toString()}
              />
            );
          }
        });
      });
    });
    return rects;
  };

  const renderGrid = () => {
    if (!showGrid || scale < 4) return null;
    const lines: JSX.Element[] = [];
    for (let x = 0; x <= PIXEL_WIDTH; x++) {
      lines.push(
        <Line
          key={`v-${x}`}
          x1={pan.x + x * scale}
          y1={pan.y}
          x2={pan.x + x * scale}
          y2={pan.y + PIXEL_HEIGHT * scale}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={1}
        />
      );
    }
    for (let y = 0; y <= PIXEL_HEIGHT; y++) {
      lines.push(
        <Line
          key={`h-${y}`}
          x1={pan.x}
          y1={pan.y + y * scale}
          x2={pan.x + PIXEL_WIDTH * scale}
          y2={pan.y + y * scale}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={1}
        />
      );
    }
    return lines;
  };

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Svg
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height - 250}
      >
        <G>
          {Array(PIXEL_HEIGHT)
            .fill(0)
            .map((_, y) =>
              Array(PIXEL_WIDTH)
                .fill(0)
                .map((_, x) => {
                  const isLight = (x + y) % 2 === 0;
                  return (
                    <Rect
                      key={`bg-${y}-${x}`}
                      x={pan.x + x * scale}
                      y={pan.y + y * scale}
                      width={scale}
                      height={scale}
                      fill={isLight ? '#ffffff' : '#e0e0e0'}
                    />
                  );
                })
            )}
        </G>
        <G>{renderPixels()}</G>
        <G>{renderGrid()}</G>
      </Svg>
    </View>
  );
}
