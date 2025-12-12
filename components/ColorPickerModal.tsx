import React from 'react';
import { View, Animated } from 'react-native';
import { Modal, Button, useTheme } from 'react-native-paper';
import { AdvancedColorPicker } from './AdvancedColorPicker';

interface ColorPickerModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ visible, onDismiss }) => {
  const theme = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // Changed to false
    }).start();
  }, [visible]);

  const modalStyle = {
    transform: [{
      scale: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
      }),
    }],
    opacity: animatedValue,
  };

  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{ backgroundColor: 'transparent' }}>
      <Animated.View style={[{ backgroundColor: theme.colors.surface, padding: 20, margin: 20, borderRadius: 8 }, modalStyle]}>
        <AdvancedColorPicker onDismiss={onDismiss} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
          <Button onPress={onDismiss} mode="contained">Cancel</Button>
        </View>
      </Animated.View>
    </Modal>
  );
};
