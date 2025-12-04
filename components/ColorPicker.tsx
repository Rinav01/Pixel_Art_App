import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import tinycolor from 'tinycolor2';
import { EditorState } from '../state/types';

const ColorPlane = ({ hue, onColorSelect }: { hue: number; onColorSelect: (color: string) => void }) => {
  const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 200 });

  const handleGesture = (event: { nativeEvent: { x: any; y: any; }; }) => {
    const { x, y } = event.nativeEvent;
    if (x >= 0 && x <= 200 && y >= 0 && y <= 200) {
      const saturation = x / 200;
      const value = 1 - y / 200;
      const color = tinycolor({ h: hue, s: saturation, v: value });
      onColorSelect(color.toHexString());
      setMarkerPosition({ x, y });
    }
  };

  const backgroundColor = useMemo(() => tinycolor({ h: hue, s: 1, v: 1 }).toHexString(), [hue]);

  return (
    <View style={styles.planeContainer}>
      <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
        <View style={[styles.plane, { backgroundColor }]}>
          <LinearGradient
            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
            style={styles.saturationOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
            style={styles.valueOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={[styles.marker, { top: markerPosition.y - 10, left: markerPosition.x - 10 }]} />
        </View>
      </PanGestureHandler>
    </View>
  );
};

export const ColorPicker = () => {
  const dispatch = useDispatch();
  const color = useSelector((state: EditorState) => state.color);
  const [hue, setHue] = useState(tinycolor(color).toHsv().h);

  const handleColorSelect = (newColor: string) => {
    dispatch({ type: 'SET_COLOR', payload: newColor });
  };

  const handleHueChange = (newHue: number) => {
    setHue(newHue);
    const { s, v } = tinycolor(color).toHsv();
    const newColor = tinycolor({ h: newHue, s, v }).toHexString();
    dispatch({ type: 'SET_COLOR', payload: newColor });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Picker</Text>
      <ColorPlane hue={hue} onColorSelect={handleColorSelect} />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={360}
        value={hue}
        onValueChange={handleHueChange}
      />
      <View style={[styles.preview, { backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planeContainer: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  plane: {
    width: '100%',
    height: '100%',
  },
  saturationOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  valueOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  slider: {
    width: 200,
    height: 40,
  },
  preview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#555',
  },
});
