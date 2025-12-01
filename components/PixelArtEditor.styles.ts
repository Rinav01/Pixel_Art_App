import { StyleSheet } from 'react-native';

const darkTheme = {
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#BB86FC',
  secondary: '#03DAC6',
  text: '#ffffff',
  placeholder: '#a0a0a0',
  border: '#333333',
  active: '#3700B3',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
  },
  leftToolbar: {
    width: 64,
    backgroundColor: darkTheme.surface,
    padding: 4,
  },
  rightSidebar: {
    width: 280,
    backgroundColor: darkTheme.surface,
    padding: 8,
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2c2c2c', // Checkerboard-like background
  },
  toolbar: {
    backgroundColor: 'transparent',
  },
  toolRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: darkTheme.border,
    marginVertical: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: darkTheme.text,
    marginVertical: 8,
  },
  scaleText: {
    color: darkTheme.text,
    marginVertical: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  colorPicker: {
    marginTop: 16,
  },
  paletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 12,
  },
  paletteColor: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: darkTheme.border,
  },
  selectedColor: {
    borderColor: darkTheme.primary,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  timeline: {
    backgroundColor: darkTheme.surface,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
    paddingVertical: 8,
    height: 80,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
  },
  frameChip: {
    marginHorizontal: 4,
    backgroundColor: darkTheme.background,
  },
  layerList: {
    gap: 8,
    marginBottom: 12,
  },
  layerItem: {
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  activeLayer: {
    backgroundColor: darkTheme.active,
    elevation: 3,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  layerName: {
    flex: 1,
    fontSize: 16,
    color: darkTheme.text,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 96,
  },
  sectionTitle: {
    color: darkTheme.text,
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  // Remove unused styles
  // modal, modalTitle, addButton, closeButton
});
