import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Surface, IconButton, Text } from 'react-native-paper';
import { styles } from '../styles';

interface ToolbarProps {
  tool: string;
  color: string;
  scale: number;
  onToolChange: (tool: string) => void;
  onColorChange: (color: string) => void;
  onScaleChange: (scale: number) => void;
}

export function Toolbar({ tool, color, scale, onToolChange, onScaleChange }: ToolbarProps) {
  return (
    <Surface style={styles.toolbar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.toolRow}>
          <IconButton
            icon="pencil"
            mode={tool === 'pen' ? 'contained' : 'outlined'}
            selected={tool === 'pen'}
            onPress={() => onToolChange('pen')}
          />
          <IconButton
            icon="eraser"
            mode={tool === 'eraser' ? 'contained' : 'outlined'}
            selected={tool === 'eraser'}
            onPress={() => onToolChange('eraser')}
          />
          <IconButton
            icon="format-color-fill"
            mode={tool === 'fill' ? 'contained' : 'outlined'}
            selected={tool === 'fill'}
            onPress={() => onToolChange('fill')}
          />
          <IconButton
            icon="eyedropper"
            mode={tool === 'eyedropper' ? 'contained' : 'outlined'}
            selected={tool === 'eyedropper'}
            onPress={() => onToolChange('eyedropper')}
          />
          <IconButton
            icon="pan"
            mode={tool === 'pan' ? 'contained' : 'outlined'}
            selected={tool === 'pan'}
            onPress={() => onToolChange('pan')}
          />
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => {}}
          />
          
          <View style={styles.divider} />
          
          <IconButton icon="magnify-minus" onPress={() => onScaleChange(Math.max(4, scale - 2))} />
          <Text style={styles.scaleText}>{scale}x</Text>
          <IconButton icon="magnify-plus" onPress={() => onScaleChange(Math.min(32, scale + 2))} />
        </View>
      </ScrollView>
    </Surface>
  );
}
