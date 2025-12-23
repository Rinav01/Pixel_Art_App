import React from 'react';
import { ScrollView, View, Animated } from 'react-native';
import { Text, List, IconButton, Button, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import type { Layer } from '../state/types';
import { getStyles } from './PixelArtEditor.styles';

interface AnimatedLayerItemProps {
  layer: Layer;
  isSelected: boolean;
  onPress: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  canDelete: boolean;
}

const AnimatedLayerItem: React.FC<AnimatedLayerItemProps> = ({
  layer,
  isSelected,
  onPress,
  onToggleVisibility,
  onDeleteLayer,
  onOpacityChange,
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
      {isSelected && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="labelSmall">Opacity: {Math.round((layer.opacity ?? 1) * 100)}%</Text>
            </View>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                value={layer.opacity ?? 1}
                onValueChange={(val) => onOpacityChange(layer.id, val)}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.onSurfaceDisabled}
                thumbTintColor={theme.colors.primary}
            />
        </View>
      )}
    </Animated.View>
  );
};

interface LayerManagerProps {
    layers: Layer[];
    currentLayer: string;
    currentFrame: number;
    dispatch: React.Dispatch<any>;
}

export const LayerManager: React.FC<LayerManagerProps> = ({ layers, currentLayer, currentFrame, dispatch }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleAddLayer = () => {
    const newLayerId = `layer${Date.now()}`;
    const newLayerName = `Layer ${layers.length + 1}`;
    dispatch({ type: 'ADD_LAYER', payload: { frameIndex: currentFrame, layerId: newLayerId, name: newLayerName } });
    dispatch({ type: 'SET_CURRENT_LAYER', payload: newLayerId });
  };
  const handleDeleteLayer = (id: string) => dispatch({ type: 'DELETE_LAYER', payload: { frameIndex: currentFrame, layerId: id } });
  const handleToggleLayerVisibility = (id: string) => dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: { frameIndex: currentFrame, layerId: id } });
  const handleSetCurrentLayer = (id: string) => dispatch({ type: 'SET_CURRENT_LAYER', payload: id });
  const handleOpacityChange = (id: string, opacity: number) => dispatch({ type: 'SET_LAYER_OPACITY', payload: { frameIndex: currentFrame, layerId: id, opacity } });

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
              onOpacityChange={handleOpacityChange}
              canDelete={layers.length > 1}
            />
          ))}
        </List.Section>
      </ScrollView>
      <Button mode="contained" onPress={handleAddLayer} style={{ marginTop: 8 }}>Add Layer</Button>
    </View>
  );
};
