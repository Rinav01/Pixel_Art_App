import React from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Chip, IconButton } from 'react-native-paper';
import type { Frame } from '../state/types';
import { styles } from './PixelArtEditor.styles';

interface TimelineProps {
  frames: Frame[];
  currentFrame: number;
  onAddFrame: () => void;
  onSetCurrentFrame: (index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ frames, currentFrame, onAddFrame, onSetCurrentFrame }) => {
  return (
    <Surface style={styles.timeline}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.timelineRow}>
          {frames.map((frame, idx) => (
            <Chip key={frame.id} selected={idx === currentFrame} onPress={() => onSetCurrentFrame(idx)} style={styles.frameChip}>
              Frame {idx + 1}
            </Chip>
          ))}
          <IconButton icon="plus" onPress={onAddFrame} />
        </View>
      </ScrollView>
    </Surface>
  );
};
