import React from 'react';
import { View, ScrollView } from 'react-native';
import { Surface, Chip, IconButton } from 'react-native-paper';
import { Frame } from '../state/types';
import { styles } from '../styles';

interface TimelineProps {
  frames: Frame[];
  currentFrame: number;
  onAddFrame: () => void;
  onSetCurrentFrame: (index: number) => void;
}

export function Timeline({ frames, currentFrame, onAddFrame, onSetCurrentFrame }: TimelineProps) {
  return (
    <Surface style={styles.timeline}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.timelineRow}>
          {frames.map((frame, idx) => (
            <Chip
              key={frame.id}
              selected={idx === currentFrame}
              onPress={() => onSetCurrentFrame(idx)}
              style={styles.frameChip}
            >
              Frame {idx + 1}
            </Chip>
          ))}
          <IconButton icon="plus" onPress={onAddFrame} />
        </View>
      </ScrollView>
    </Surface>
  );
}
