import React from 'react';
import { ScrollView, View, Animated } from 'react-native';
import { Text, List, IconButton, Button, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import type { EditorState, Layer } from '../state/types';
import { getStyles } from './PixelArtEditor.styles';

interface AnimatedLayerItemProps {
  layer: Layer;
  isSelected: boolean;
  onPress: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  canDelete: boolean;
}

const AnimatedLayerItem: React.FC<AnimatedLayerItemProps> = ({
  layer,
  isSelected,
  onPress,
  onToggleVisibility,
  onDeleteLayer,
  canDelete,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
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
    outputRange: [1, 1.03], // Slightly smaller scale for subtle effect
  });

  return (
    <Animated.View style={[styles.layerItem, { backgroundColor, transform: [{ scale }] }]}>
      <List.Item
        title={layer.name}
        onPress={() => onPress(layer.id)}
        titleStyle={{ color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurface }}
        right={() => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon={layer.isVisible ? 'eye' : 'eye-off'}
              size={20}
              onPress={() => onToggleVisibility(layer.id)}
              iconColor={isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurface}
            />
            {canDelete && (
              <IconButton
                icon="delete"
                size={20}
                onPress={() => onDeleteLayer(layer.id)}
                iconColor={isSelected ? theme.colors.onErrorContainer : theme.colors.error}
              />
            )}
          </View>
        )}
      />
    </Animated.View>
  );
};

export const LayerManager: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const { layers, currentFrame, currentLayer } = useSelector((s: EditorState) => ({
    layers: s.frames[s.currentFrame].layers,
    currentLayer: s.currentLayer,
    currentFrame: s.currentFrame,
  }));

  const handleAddLayer = () => dispatch({ type: 'ADD_LAYER' });
  const handleDeleteLayer = (id: string) => dispatch({ type: 'DELETE_LAYER', payload: id });
  const handleToggleLayerVisibility = (id: string) => dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: id });
  const handleSetCurrentLayer = (id: string) => dispatch({ type: 'SET_CURRENT_LAYER', payload: id });

  return (
    <View>
      <Text variant="headlineSmall" style={styles.sectionTitle}>Layers</Text>
      <ScrollView style={{ maxHeight: 250 }}>
        <List.Section>
          {[...layers].reverse().map(layer => (
            <AnimatedLayerItem
              key={layer.id}
              layer={layer}
              isSelected={layer.id === currentLayer}
              onPress={handleSetCurrentLayer}
              onToggleVisibility={handleToggleLayerVisibility}
              onDeleteLayer={handleDeleteLayer}
              canDelete={layers.length > 1}
            />
          ))}
        </List.Section>
      </ScrollView>
      <Button mode="contained" onPress={handleAddLayer} style={{ marginTop: 8 }}>Add Layer</Button>
    </View>
  );
};
