import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Surface, IconButton, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import type { EditorState, Layer } from '../state/types';
import { styles } from './PixelArtEditor.styles';

export const LayerManager: React.FC = () => {
  const dispatch = useDispatch();
  const { layers, currentLayer } = useSelector((s: EditorState) => ({
    layers: s.frames[s.currentFrame].layers,
    currentLayer: s.currentLayer,
  }));

  const handleAddLayer = () => dispatch({ type: 'ADD_LAYER' });
  const handleDeleteLayer = (id: string) => dispatch({ type: 'DELETE_LAYER', payload: id });
  const handleToggleLayerVisibility = (id: string) => dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: id });
  const handleSetCurrentLayer = (id: string) => dispatch({ type: 'SET_CURRENT_LAYER', payload: id });

  return (
    <View>
      <Text variant="headlineSmall" style={styles.sectionTitle}>Layers</Text>
      <ScrollView style={styles.layerList}>
        {[...layers].reverse().map(layer => (
          <Surface key={layer.id} style={[styles.layerItem, layer.id === currentLayer && styles.activeLayer]}>
            <View style={styles.layerRow}>
              <IconButton icon={layer.isVisible ? 'eye' : 'eye-off'} size={20} onPress={() => handleToggleLayerVisibility(layer.id)} iconColor="#fff" />
              <Text style={styles.layerName} onPress={() => handleSetCurrentLayer(layer.id)}>{layer.name}</Text>
              {layers.length > 1 && <IconButton icon="delete" size={20} iconColor="red" onPress={() => handleDeleteLayer(layer.id)} />}
            </View>
          </Surface>
        ))}
      </ScrollView>
      <Button mode="contained" onPress={handleAddLayer} style={{ marginTop: 8 }}>Add Layer</Button>
    </View>
  );
};
