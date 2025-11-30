import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toolbar: {
    elevation: 2,
    paddingVertical: 8,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#333',
    marginHorizontal: 8,
  },
  scaleText: {
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  colorPicker: {
    elevation: 2,
    paddingVertical: 12,
  },
  paletteRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 8,
  },
  paletteColor: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  selectedColor: {
    borderColor: '#2196F3',
    borderWidth: 3,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  timeline: {
    elevation: 4,
    paddingVertical: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
  },
  frameChip: {
    marginHorizontal: 4,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  layerList: {
    maxHeight: 400,
  },
  layerItem: {
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  activeLayer: {
    backgroundColor: '#e3f2fd',
    elevation: 3,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  layerName: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    marginTop: 16,
  },
  closeButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
