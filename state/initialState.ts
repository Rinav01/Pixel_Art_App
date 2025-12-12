import { EditorState } from './types';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from './constants';

export const initialState: EditorState = {
  frames: [
    {
      id: 'frame1',
      layers: [
        {
          id: 'layer1',
          name: 'Layer 1',
          isVisible: true,
          pixels: Array(PIXEL_HEIGHT).fill(0).map(() => Array(PIXEL_WIDTH).fill(null)),
        },
      ],
    },
  ],
  currentFrame: 0,
  currentLayer: 'layer1',
  color: '#000000',
  tool: 'pen',
  palette: [], // Add your default palette here, e.g. ['#000000', '#FFFFFF']
  undoStack: [],
  redoStack: [],
};
