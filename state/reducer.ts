import { EditorState } from './types';

export const initialState: EditorState = {
  frames: [
    {
      id: 'frame1',
      layers: [
        {
          id: 'layer1',
          name: 'Layer 1',
          isVisible: true,
          pixels: Array(32)
            .fill(0)
            .map(() => Array(32).fill(0)),
        },
      ],
    },
  ],
  currentFrame: 0,
  currentLayer: 'layer1',
  color: '#000000',
  tool: 'pen',
};

export function editorReducer(state: EditorState = initialState, action: any): EditorState {
  switch (action.type) {
    case 'ADD_FRAME':
      const newFrame = {
        id: `frame${state.frames.length + 1}`,
        layers: state.frames[state.currentFrame].layers.map(layer => ({
          ...layer,
          pixels: layer.pixels.map(row => [...row]),
        })),
      };
      return {
        ...state,
        frames: [...state.frames, newFrame],
        currentFrame: state.frames.length,
      };
    case 'SET_CURRENT_FRAME':
      return {
        ...state,
        currentFrame: action.payload,
      };
    case 'SET_TOOL':
      return {
        ...state,
        tool: action.payload,
      };
    case 'SET_COLOR':
      return {
        ...state,
        color: action.payload,
      };
    case 'ADD_LAYER':
      const newLayer = {
        id: `layer${Date.now()}`,
        name: `Layer ${state.frames[state.currentFrame].layers.length + 1}`,
        isVisible: true,
        pixels: Array(32)
          .fill(0)
          .map(() => Array(32).fill(0)),
      };
      const framesWithNewLayer = state.frames.map((frame, index) => {
        if (index === state.currentFrame) {
          return {
            ...frame,
            layers: [...frame.layers, newLayer],
          };
        }
        return frame;
      });
      return {
        ...state,
        frames: framesWithNewLayer,
        currentLayer: newLayer.id,
      };
    case 'DELETE_LAYER':
      const framesWithDeletedLayer = state.frames.map((frame, index) => {
        if (index === state.currentFrame) {
          return {
            ...frame,
            layers: frame.layers.filter(layer => layer.id !== action.payload),
          };
        }
        return frame;
      });
      return {
        ...state,
        frames: framesWithDeletedLayer,
        currentLayer: state.frames[state.currentFrame].layers[0].id,
      };
    case 'TOGGLE_LAYER_VISIBILITY':
      const framesWithToggledLayer = state.frames.map((frame, index) => {
        if (index === state.currentFrame) {
          return {
            ...frame,
            layers: frame.layers.map(layer => {
              if (layer.id === action.payload) {
                return {
                  ...layer,
                  isVisible: !layer.isVisible,
                };
              }
              return layer;
            }),
          };
        }
        return frame;
      });
      return {
        ...state,
        frames: framesWithToggledLayer,
      };
    case 'SET_CURRENT_LAYER':
      return {
        ...state,
        currentLayer: action.payload,
      };
    case 'DRAW_PIXEL':
      const { x, y } = action.payload;
      const framesWithDrawnPixel = state.frames.map((frame, frameIndex) => {
        if (frameIndex === state.currentFrame) {
          return {
            ...frame,
            layers: frame.layers.map(layer => {
              if (layer.id === state.currentLayer) {
                const newPixels = layer.pixels.map(row => [...row]);
                newPixels[y][x] = state.color;
                return {
                  ...layer,
                  pixels: newPixels,
                };
              }
              return layer;
            }),
          };
        }
        return frame;
      });
      return {
        ...state,
        frames: framesWithDrawnPixel,
      };
    default:
      return state;
  }
}
