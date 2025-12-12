import { StyleSheet } from 'react-native';
import { MD3Theme } from 'react-native-paper';

export const getStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
  },
  leftToolbar: {
    width: 64,
    backgroundColor: theme.colors.surface,
    padding: 4,
  },
  rightSidebar: {
    width: 280,
    backgroundColor: theme.colors.surface,
    padding: 8,
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.onSurfaceVariant, 
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
    backgroundColor: theme.colors.outline,
    marginVertical: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.onSurface,
    marginVertical: 8,
  },
  scaleText: {
    color: theme.colors.onSurface,
    marginVertical: 4,
    fontSize: 14,
    fontWeight: 'bold',
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
    borderColor: theme.colors.outline,
  },
  selectedColor: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  timeline: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
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
    backgroundColor: theme.colors.background,
  },
  layerList: {
    gap: 8,
    marginBottom: 12,
  },
  layerItem: {
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
  },
  activeLayer: {
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.onSurface,
  },
  
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
});
