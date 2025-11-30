export interface Layer {
  id: string;
  name: string;
  isVisible: boolean;
  pixels: number[][];
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
}
