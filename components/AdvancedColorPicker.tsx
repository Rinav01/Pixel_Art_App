import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import tinycolor from 'tinycolor2';
import { useTheme, Button } from 'react-native-paper';
import { EditorState } from '../state/types';

const ColorPlane = ({ hue, saturation, value, onColorSelect, styles }: { hue: number; saturation: number; value: number; onColorSelect: (color: string) => void, styles: any }) => {
  const [markerPosition, setMarkerPosition] = useState({ x: saturation * 200, y: (1 - value) * 200 });
  const [isGestureActive, setIsGestureActive] = useState(false);

  useEffect(() => {
    setMarkerPosition({ x: saturation * 200, y: (1 - value) * 200 });
  }, [saturation, value]);

  const handleGestureStateChange = (event: { nativeEvent: { state: number; x: number; y: number; }; }) => {
    const { state, x, y } = event.nativeEvent;
    if (state === State.BEGAN) {
      setIsGestureActive(true);
    } else if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
      setIsGestureActive(false);
    }
    if (isGestureActive && x >= 0 && x <= 200 && y >= 0 && y <= 200) {
      const newSaturation = x / 200;
      const newValue = 1 - y / 200;
      const color = tinycolor({ h: hue, s: newSaturation, v: newValue });
      onColorSelect(color.toHexString());
      setMarkerPosition({ x, y });
    }
  };

  const handleGestureEvent = (event: { nativeEvent: { x: number; y: number; }; }) => {
    if (!isGestureActive) return;
    const { x, y } = event.nativeEvent;
    if (x >= 0 && x <= 200 && y >= 0 && y <= 200) {
      const newSaturation = x / 200;
      const newValue = 1 - y / 200;
      const color = tinycolor({ h: hue, s: newSaturation, v: newValue });
      onColorSelect(color.toHexString());
      setMarkerPosition({ x, y });
    }
  };

  const backgroundColor = useMemo(() => tinycolor({ h: hue, s: 1, v: 1 }).toHexString(), [hue]);

  return (
    <View style={styles.planeContainer}>
      <PanGestureHandler onHandlerStateChange={handleGestureStateChange} onGestureEvent={handleGestureEvent}>
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

export const AdvancedColorPicker = ({ onDismiss }: { onDismiss?: () => void }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const color = useSelector((state: EditorState) => state.color);
  const [selectedColor, setSelectedColor] = useState(color);
  const [hue, setHue] = useState(tinycolor(color).toHsv().h);
  const [saturation, setSaturation] = useState(tinycolor(color).toHsv().s);
  const [value, setValue] = useState(tinycolor(color).toHsv().v);

  const handleColorSelect = (newColor: string) => {
    setSelectedColor(newColor);
    const hsv = tinycolor(newColor).toHsv();
    setHue(hsv.h);
    setSaturation(hsv.s);
    setValue(hsv.v);
    dispatch({ type: 'SET_COLOR', payload: newColor });
  };

  const handleHueChange = (newHue: number) => {
    setHue(newHue);
    const newColor = tinycolor({ h: newHue, s: saturation, v: value }).toHexString();
    setSelectedColor(newColor);
    dispatch({ type: 'SET_COLOR', payload: newColor });
  };

  const handleAddToPalette = () => {
    console.log('Adding to palette:', selectedColor);
    dispatch({ type: 'ADD_COLOR_TO_PALETTE', payload: selectedColor });
    console.log('onDismiss exists:', !!onDismiss);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (

      <View style={styles.container}>

        <View style={styles.backdrop} onTouchEnd={onDismiss} />

        <View style={{

          backgroundColor: theme.colors.surface,

          alignItems: 'center',

          paddingVertical: 24,

          paddingHorizontal: 20,

          borderRadius: 12,

          shadowColor: theme.colors.shadow,

          shadowOffset: { width: 0, height: 4 },

          shadowOpacity: 0.2,

          shadowRadius: 12,

          elevation: 8,

          borderWidth: 1,

          borderColor: theme.colors.outline,

        }}>

              <Text style={styles.title}>Color Picker</Text>

              <ColorPlane hue={hue} saturation={saturation} value={value} onColorSelect={handleColorSelect} styles={styles} />

              <Slider

                style={styles.slider}

                minimumValue={0}

                maximumValue={360}

                value={hue}

                onValueChange={handleHueChange}

              />

              <View style={[styles.preview, { backgroundColor: selectedColor }]} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 16 }}>

                <Button mode="outlined" onPress={onDismiss}>

                  Cancel

                </Button>

                <Button mode="contained" onPress={handleAddToPalette}>

                  Add to Palette

                </Button>

              </View>

        </View>

      </View>

    );

  };

  

  const getStyles = (theme: any) => StyleSheet.create({

    container: {

      position: 'absolute',

      top: 0,

      left: 0,

      right: 0,

      bottom: 0,

      zIndex: 100,

      alignItems: 'center',

      justifyContent: 'center',

    },

    backdrop: {

      ...StyleSheet.absoluteFillObject,

      backgroundColor: 'rgba(0,0,0,0.5)',

    },

    title: {

      fontSize: 18,

      fontWeight: '600',

      marginBottom: 16,

      color: theme.colors.onSurface,

    },
  planeContainer: {
    width: 220,
    height: 220,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.outline,
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
    borderColor: theme.colors.onSurface,
    position: 'absolute',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  slider: {
    width: 220,
    height: 40,
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    borderColor: theme.colors.outline,
  },
});