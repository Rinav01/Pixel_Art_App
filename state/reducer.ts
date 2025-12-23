import { EditorState } from './types';
import { initialState as baseInitialState } from './initialState';
import { produce } from 'immer';
import { floodFill } from './utils';
import { PIXEL_HEIGHT, PIXEL_WIDTH } from './constants';

export const editorReducer = produce((draft: EditorState, action: any): EditorState => {
  switch (action.type) {
    case 'DRAW_PIXEL': {
      const { frameIndex, layerId, x, y, color } = action.payload;
      const frame = draft.frames[frameIndex];
      if (frame) {
        const layer = frame.layers.find(l => l.id === layerId);
        if (layer && layer.pixels) {
          layer.pixels[y][x] = color;
        }
      }
      return draft;
    }
    case 'FILL': {
      const { frameIndex, layerId, x, y, color } = action.payload;
      const frame = draft.frames[frameIndex];
      if (frame) {
        const layer = frame.layers.find(l => l.id === layerId);
        if (layer && layer.pixels) {
          layer.pixels = floodFill(layer.pixels, x, y, color);
        }
      }
      return draft;
    }
    case 'ADD_FRAME': {
      const newFrame = {
        id: `frame${Date.now()}`,
        layers: [
          {
            id: `layer${Date.now()}`,
            name: 'Layer 1',
            isVisible: true,
          opacity: 1,
            pixels: Array(PIXEL_HEIGHT).fill(0).map(() => Array(PIXEL_WIDTH).fill(null)),
          },
        ],
      };
      draft.frames.push(newFrame);
      return draft;
    }
    case 'DELETE_FRAME': {
      draft.frames.splice(action.payload.frameIndex, 1);
      if (draft.frames.length === 0) {
        const newFrame = {
          id: `frame${Date.now()}`,
          layers: [
            {
              id: `layer${Date.now()}`,
              name: 'Layer 1',
              isVisible: true,
          opacity: 1,
              pixels: Array(PIXEL_HEIGHT).fill(0).map(() => Array(PIXEL_WIDTH).fill(null)),
            },
          ],
        };
        draft.frames.push(newFrame);
      }
      return draft;
    }
    case 'ADD_LAYER': {
      const frame = draft.frames[action.payload.frameIndex];
      if (frame) {
        const newLayer = {
          id: action.payload.layerId,
          name: action.payload.name,
          isVisible: true,
          opacity: 1,
          pixels: Array(PIXEL_HEIGHT).fill(0).map(() => Array(PIXEL_WIDTH).fill(null)),
        };
        frame.layers.push(newLayer);
      }
      return draft;
    }
    case 'DELETE_LAYER': {
      const frame = draft.frames[action.payload.frameIndex];
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
      return draft;
    }
    case 'TOGGLE_LAYER_VISIBILITY': {
      const frame = draft.frames[action.payload.frameIndex];
      if (frame) {
        const layer = frame.layers.find(l => l.id === action.payload.layerId);
        if (layer) {
          layer.isVisible = !layer.isVisible;
        }
      }
      return draft;
    }
    case 'SET_LAYER_OPACITY': {
      const frame = draft.frames[action.payload.frameIndex];
      if (frame) {
        const layer = frame.layers.find(l => l.id === action.payload.layerId);
        if (layer) {
          layer.opacity = action.payload.opacity;
        }
      }
      return draft;
    }
    case 'SET_CURRENT_FRAME': {
      draft.currentFrame = action.payload;
      return draft;
    }
    case 'SET_TOOL': {
      draft.tool = action.payload;
      return draft;
    }
    case 'SET_COLOR': {
      draft.color = action.payload;
      return draft;
    }
    case 'ADD_COLOR_TO_PALETTE': {
      if (!draft.palette.includes(action.payload)) {
        draft.palette.push(action.payload);
      }
      return draft;
    }
    case 'REMOVE_COLOR_FROM_PALETTE': {
      draft.palette = draft.palette.filter(c => c !== action.payload);
      return draft;
    }
    case 'SET_CURRENT_LAYER': {
      draft.currentLayer = action.payload;
      return draft;
    }
    default:
      return draft;
  }
}, baseInitialState);
