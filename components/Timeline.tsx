import React from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { Surface, Chip, IconButton, useTheme, Text } from 'react-native-paper';
import type { Frame } from '../state/types';
import { getStyles } from './PixelArtEditor.styles';

interface AnimatedChipProps {
  frame: Frame;
  idx: number;
  isSelected: boolean;
  onPress: (index: number) => void;
  onDelete: (id: string) => void;
  styles: any;
}

const AnimatedChip: React.FC<AnimatedChipProps> = ({ frame, idx, isSelected, onPress, onDelete, styles }) => {
  const theme = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isSelected ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [isSelected]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surfaceVariant, theme.colors.primaryContainer],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <Animated.View style={[styles.frameChip, { transform: [{ scale }] }]}>
      <Chip
        style={{ backgroundColor }}
        selected={isSelected}
        onPress={() => onPress(idx)}
        onClose={idx > 0 ? () => onDelete(frame.id) : undefined}
      >
        <Text style={{ color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurface }}>{`Frame ${idx + 1}`}</Text>
      </Chip>
    </Animated.View>
  );
};

interface TimelineProps {
  frames: Frame[];
  currentFrame: number;
  onAddFrame: () => void;
  onSetCurrentFrame: (index: number) => void;
  onDeleteFrame: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ frames, currentFrame, onAddFrame, onSetCurrentFrame, onDeleteFrame }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Surface style={styles.timeline}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.timelineRow}>
          {frames.map((frame, idx) => (
            <AnimatedChip
              key={frame.id}
              frame={frame}
              idx={idx}
              isSelected={idx === currentFrame}
              onPress={onSetCurrentFrame}
              onDelete={onDeleteFrame}
              styles={styles}
            />
          ))}
          <IconButton icon="plus" onPress={onAddFrame} />
        </View>
      </ScrollView>
    </Surface>
  );
};
