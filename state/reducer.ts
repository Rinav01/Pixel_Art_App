// src/state/reducer.ts
import { EditorState, EditorStateSnapshot, Frame, Layer } from './types';
import { PIXEL_WIDTH, PIXEL_HEIGHT } from './constants';
import { initialState as baseInitialState } from './initialState';

// helper to deep copy frames/layers/pixels
function cloneFrames(frames: Frame[]): Frame[] {
  return frames.map(f => ({
    ...f,
    layers: f.layers.map(l => ({
      ...l,
      pixels: l.pixels.map(row => [...row]),
    })),
  }));
}

function cloneLayers(layers: Layer[]): Layer[] {
  return layers.map(l => ({
    ...l,
    pixels: l.pixels.map(row => [...row]),
  }));
}

function snapshot(state: EditorState): EditorStateSnapshot {
  return {
    frames: cloneFrames(state.frames),
    currentFrame: state.currentFrame,
    currentLayer: state.currentLayer,
    color: state.color,
    tool: state.tool,
    palette: [...state.palette],
  };
}

function floodFill(pixels: (string | null)[][], startX: number, startY: number, newColor: string | null) {
  const h = pixels.length;
  const w = pixels[0].length;
  if (startX < 0 || startX >= w || startY < 0 || startY >= h) return pixels;
  const target = pixels[startY][startX];
  if (target === newColor) return pixels;
  const stack: [number, number][] = [[startX, startY]];
  const result = pixels.map(row => [...row]);
  while (stack.length) {
    const [x, y] = stack.pop()!;
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    if (result[y][x] !== target) continue;
    result[y][x] = newColor;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return result;
}

export const initialState: EditorState = baseInitialState;

export function editorReducer(state: EditorState = initialState, action: any): EditorState {
  switch (action.type) {
    case 'PUSH_SNAPSHOT': {
      const snap: EditorStateSnapshot = action.payload ?? snapshot(state);
      const undoStack = [...state.undoStack, snap].slice(-50); // cap
      return { ...state, undoStack, redoStack: [] };
    }

    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      const last = state.undoStack[state.undoStack.length - 1];
      const undoStack = state.undoStack.slice(0, -1);
      const redoStack = [...state.redoStack, snapshot(state)].slice(-50);
      return {
        ...state,
        frames: cloneFrames(last.frames),
        currentFrame: last.currentFrame,
        currentLayer: last.currentLayer,
        color: last.color,
        tool: last.tool,
        palette: [...last.palette],
        undoStack,
        redoStack,
      };
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      const redoStack = state.redoStack.slice(0, -1);
      const undoStack = [...state.undoStack, snapshot(state)].slice(-50);
      return {
        ...state,
        frames: cloneFrames(next.frames),
        currentFrame: next.currentFrame,
        currentLayer: next.currentLayer,
        color: next.color,
        tool: next.tool,
        palette: [...next.palette],
        undoStack,
        redoStack,
      };
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
      return {
        ...state,
        frames: [...state.frames, newFrame],
        currentFrame: state.frames.length,
        undoStack: [...state.undoStack, snapshot(state)].slice(-50),
        redoStack: [],
      };
    }

    case 'SET_CURRENT_FRAME': {
      return { ...state, currentFrame: action.payload };
    }

    case 'SET_TOOL': {
      return { ...state, tool: action.payload };
    }

    case 'SET_COLOR': {
      return { ...state, color: action.payload };
    }

    case 'ADD_COLOR_TO_PALETTE': {
      if (state.palette.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        palette: [...state.palette, action.payload],
        undoStack: [...state.undoStack, snapshot(state)].slice(-50),
        redoStack: [],
      };
    }

    case 'REMOVE_COLOR_FROM_PALETTE': {
      return {
        ...state,
        palette: state.palette.filter(c => c !== action.payload),
        undoStack: [...state.undoStack, snapshot(state)].slice(-50),
        redoStack: [],
      };
    }

    case 'ADD_LAYER': {
      const newLayer: Layer = {
        id: `layer${Date.now()}`,
        name: `Layer ${state.frames[state.currentFrame].layers.length + 1}`,
        isVisible: true,
        pixels: Array(PIXEL_HEIGHT).fill(0).map(() => Array(PIXEL_WIDTH).fill(null)),
      };
      const frames = cloneFrames(state.frames);
      frames[state.currentFrame].layers.push(newLayer);
      return {
        ...state,
        frames,
        currentLayer: newLayer.id,
        undoStack: [...state.undoStack, snapshot(state)].slice(-50),
        redoStack: [],
      };
    }

    case 'DELETE_LAYER': {
      const frames = cloneFrames(state.frames);
      let layers = frames[state.currentFrame].layers.filter(l => l.id !== action.payload);
      
      // Re-number layers
      let layerNumber = 1;
      layers = layers.map(layer => {
        if (layer.name.startsWith('Layer ')) {
          return { ...layer, name: `Layer ${layerNumber++}` };
        }
        return layer;
      });

      frames[state.currentFrame].layers = layers;
      const newCurrentLayer = layers.length > 0 ? layers[0].id : '';
      return {
        ...state,
        frames,
        currentLayer: newCurrentLayer,
        undoStack: [...state.undoStack, snapshot(state)].slice(-50),
        redoStack: [],
      };
    }

    case 'TOGGLE_LAYER_VISIBILITY': {
      const frames = cloneFrames(state.frames);
      frames[state.currentFrame].layers = frames[state.currentFrame].layers.map(l =>
        l.id === action.payload ? { ...l, isVisible: !l.isVisible } : l
      );
      return {
        ...state,
        frames,
        undoStack: [...state.undoStack, snapshot(state)].slice(-50),
        redoStack: [],
      };
    }

    case 'SET_CURRENT_LAYER': {
      return { ...state, currentLayer: action.payload };
    }

    case 'DRAW_PIXEL': {
      // payload: { x, y, color?, tool? }
      const { x, y, color: payloadColor, tool: payloadTool } = action.payload;
      if (typeof x !== 'number' || typeof y !== 'number') return state;
      if (x < 0 || x >= PIXEL_WIDTH || y < 0 || y >= PIXEL_HEIGHT) return state;

      const frames = cloneFrames(state.frames);
      const frame = frames[state.currentFrame];
      frame.layers = frame.layers.map(layer => {
        if (layer.id !== state.currentLayer) return layer;
        const newPixels = layer.pixels.map(row => [...row]);
        const activeTool = payloadTool ?? state.tool;
        const drawColor = payloadColor ?? state.color;
        if (activeTool === 'eraser') {
          newPixels[y][x] = null;
        } else {
          newPixels[y][x] = drawColor;
        }
        return { ...layer, pixels: newPixels };
      });

      return {
        ...state,
        frames,
        undoStack: [...state.undoStack, snapshot(state)].slice(-50),
        redoStack: [],
      };
    }

    case 'FILL': {
      // payload: { x, y, color }
      const { x, y, color } = action.payload;
      if (x < 0 || x >= PIXEL_WIDTH || y < 0 || y >= PIXEL_HEIGHT) return state;
      const frames = cloneFrames(state.frames);
      const frame = frames[state.currentFrame];
      frame.layers = frame.layers.map(layer => {
        if (layer.id !== state.currentLayer) return layer;
        const newPixels = floodFill(layer.pixels, x, y, color);
        return { ...layer, pixels: newPixels };
      });
      return {
        ...state,
        frames,
        undoStack: [...state.undoStack, snapshot(state)].slice(-50),
        redoStack: [],
      };
    }

    default:
      return state;
  }
}
