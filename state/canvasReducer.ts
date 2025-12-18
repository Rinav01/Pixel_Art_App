import { Frame, Layer } from './types';
import { produce } from 'immer';
import { floodFill } from './utils';
import { PIXEL_HEIGHT, PIXEL_WIDTH } from './constants';

export type CanvasAction =
  | { type: 'DRAW_PIXEL'; payload: { frameIndex: number; layerId: string; x: number; y: number; color: string | null } }
  | { type: 'FILL'; payload: { frameIndex: number; layerId: string; x: number; y: number; color: string | null } }
  | { type: 'SET_FRAMES'; payload: Frame[] }
  | { type: 'ADD_FRAME' }
  | { type: 'DELETE_FRAME'; payload: { frameIndex: number } }
  | { type: 'ADD_LAYER'; payload: { frameIndex: number, layerId: string, name: string } }
  | { type: 'DELETE_LAYER'; payload: { frameIndex: number, layerId: string } }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: { frameIndex: number, layerId: string } };

export const canvasReducer = produce((draft: Frame[], action: CanvasAction) => {
  switch (action.type) {
    case 'DRAW_PIXEL': {
      const { frameIndex, layerId, x, y, color } = action.payload;
      const frame = draft[frameIndex];
      if (frame) {
        const layer = frame.layers.find(l => l.id === layerId);
        if (layer && layer.pixels) {
          layer.pixels[y][x] = color;
        }
      }
      break;
    }
    case 'FILL': {
      const { frameIndex, layerId, x, y, color } = action.payload;
      const frame = draft[frameIndex];
      if (frame) {
        const layer = frame.layers.find(l => l.id === layerId);
        if (layer && layer.pixels) {
          layer.pixels = floodFill(layer.pixels, x, y, color);
        }
      }
      break;
    }
    case 'ADD_FRAME': {
      const newFrame: Frame = {
        id: `frame${Date.now()}`,
        layers: [
          {
            id: `layer${Date.now()}`,
            name: 'Layer 1',
            isVisible: true,
            pixels: Array(PIXEL_HEIGHT).fill(0).map(() => Array(PIXEL_WIDTH).fill(null)),
          },
        ],
      };
      draft.push(newFrame);
      break;
    }
    case 'DELETE_FRAME': {
      draft.splice(action.payload.frameIndex, 1);
      break;
    }
    case 'ADD_LAYER': {
      const frame = draft[action.payload.frameIndex];
      if (frame) {
        const newLayer: Layer = {
          id: action.payload.layerId,
          name: action.payload.name,
          isVisible: true,
          pixels: Array(PIXEL_HEIGHT).fill(0).map(() => Array(PIXEL_WIDTH).fill(null)),
        };
        frame.layers.push(newLayer);
      }
      break;
    }
    case 'DELETE_LAYER': {
      const frame = draft[action.payload.frameIndex];
      if (frame) {
        let layers = frame.layers.filter(l => l.id !== action.payload.layerId);
        let layerNumber = 1;
        layers = layers.map(layer => {
          if (layer.name.startsWith('Layer ')) {
            return { ...layer, name: `Layer ${layerNumber++}` };
          }
          return layer;
        });
        frame.layers = layers;
      }
      break;
    }
    case 'TOGGLE_LAYER_VISIBILITY': {
      const frame = draft[action.payload.frameIndex];
      if (frame) {
        const layer = frame.layers.find(l => l.id === action.payload.layerId);
        if (layer) {
          layer.isVisible = !layer.isVisible;
        }
      }
      break;
    }
    case 'SET_FRAMES': {
      return action.payload;
    }
  }
});
