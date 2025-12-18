import React from 'react';
import { Surface, useTheme } from 'react-native-paper';
import { LayerManager } from './LayerManager';
import { ColorPicker } from './ColorPicker';
import { getStyles } from './PixelArtEditor.styles';
import type { Layer } from '../state/types';
import { Palette } from './Palette';
import { Preview } from './Preview';

interface RightSidebarProps {
    layers: Layer[];
    currentLayer: string;
    currentFrame: number;
    dispatch: React.Dispatch<any>;
    selectedTool: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ layers, currentLayer, currentFrame, dispatch, selectedTool }) => {
  const theme = useTheme();

  return (
    <Surface style={getStyles(theme).rightSidebar}>
      <Preview layers={layers} selectedTool={selectedTool} />
      <LayerManager 
        layers={layers}
        currentLayer={currentLayer}
        currentFrame={currentFrame}
        dispatch={dispatch}
      />
      <ColorPicker />
      <Palette />
    </Surface>
  );
};
