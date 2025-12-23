export interface Layer {
  id: string;
  name: string;
  isVisible: boolean;
  opacity?: number;
  // color string (hex) or null for transparent
  pixels: (string | null)[][];
}

export interface Frame {
  id: string;
  layers: Layer[];
}

export interface EditorState {
  frames: Frame[];
  currentFrame: number;
  currentLayer: string;
  color: string;
  tool: string;
  palette: string[];
  // simple undo/redo stacks (store serialized snapshots)
  undoStack: EditorStateSnapshot[];
  redoStack: EditorStateSnapshot[];
}

export type EditorStateSnapshot = {
  frames: Frame[];
  currentFrame: number;
  currentLayer: string;
  color: string;
  tool: string;
  palette: string[];
};
