import React from 'react';
import { Animated } from 'react-native';
import { Appbar } from 'react-native-paper';

interface AnimatedAppbarActionProps {
  icon: string;
  onPress: () => void;
  color?: string;
}

export const AnimatedAppbarAction: React.FC<AnimatedAppbarActionProps> = ({ icon, onPress, color }) => {
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  const handleMouseEnter = () => {
    Animated.spring(animatedScale, {
      toValue: 1.2,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const handleMouseLeave = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: animatedScale }] }}
      {...({ onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } as any)}
    >
      <Appbar.Action icon={icon} onPress={onPress} color={color} />
    </Animated.View>
  );
};
