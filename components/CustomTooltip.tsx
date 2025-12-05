import React from 'react';
import { Pressable, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface CustomTooltipProps {
  title: string;
  children: React.ReactNode;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ title, children }) => {
  const theme = useTheme();
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = React.useState(false);

  const handleMouseEnter = () => {
    setVisible(true);
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleMouseLeave = () => {
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  return (
    <Pressable onHoverIn={handleMouseEnter} onHoverOut={handleMouseLeave}>
      {children}
      {visible && (
        <Animated.View style={[
          styles.tooltipContainer,
          {
            backgroundColor: theme.colors.inverseSurface,
            opacity: animatedOpacity,
            left: '100%',
            top: '50%',
            transform: [{ translateY: -15 }], // Center the tooltip vertically
          }
        ]}>
          <Text style={{ color: theme.colors.inverseOnSurface }}>{title}</Text>
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
    zIndex: 1,
  },
});
