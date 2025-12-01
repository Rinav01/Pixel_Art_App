import React from 'react';
import { ScrollView, View } from 'react-native';
import { Portal, Modal, Text, Surface, IconButton, Button } from 'react-native-paper';
import { Layer } from '../state/types';
import { styles } from './PixelArtEditor.styles';


interface LayerManagerProps {
  visible: boolean;
  layers: Layer[];
  currentLayer: string;
  onDismiss: () => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onToggleLayerVisibility: (id: string) => void;
  onSetCurrentLayer: (id: string) => void;
}

export function LayerManager({
  visible,
  layers,
  currentLayer,
  onDismiss,
  onAddLayer,
  onDeleteLayer,
  onToggleLayerVisibility,
  onSetCurrentLayer,
}: LayerManagerProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Text variant="headlineSmall" style={styles.modalTitle}>Layers</Text>
        <ScrollView style={styles.layerList}>
          {[...layers].reverse().map((layer) => {
            return (
              <Surface
                key={layer.id}
                style={[
                  styles.layerItem,
                  layer.id === currentLayer && styles.activeLayer
                ]}
              >
                <View style={styles.layerRow}>
                  <IconButton
                    icon={layer.isVisible ? 'eye' : 'eye-off'}
                    size={20}
                    onPress={() => onToggleLayerVisibility(layer.id)}
                  />
                  <Text
                    style={styles.layerName}
                    onPress={() => onSetCurrentLayer(layer.id)}
                  >
                    {layer.name}
                  </Text>
                  {layers.length > 1 && (
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor="red"
                      onPress={() => onDeleteLayer(layer.id)}
                    />
                  )}
                </View>
              </Surface>
            );
          })}
        </ScrollView>
        <Button mode="contained" onPress={onAddLayer} style={styles.addButton}>
          Add Layer
        </Button>
        <Button onPress={onDismiss} style={styles.closeButton}>
          Close
        </Button>
      </Modal>
    </Portal>
  );
}
