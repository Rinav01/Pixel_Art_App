import { EditorState, EditorStateSnapshot } from './types';

// Action types
const UNDO = 'UNDO';
const REDO = 'REDO';

// Action creators
export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });

// Helper function to create a snapshot of the current state
const createSnapshot = (state: EditorState): EditorStateSnapshot => {
  const { frames, currentFrame, currentLayer, color, tool, palette } = state;
  return { frames, currentFrame, currentLayer, color, tool, palette };
};


export const undoable = (reducer: any) => {
  // Initial state with empty undo/redo stacks
  const initialState: EditorState = {
    ...reducer(undefined, {}),
    undoStack: [],
    redoStack: [],
  };

  return (state = initialState, action: any): EditorState => {
    const { undoStack, redoStack, ...rest } = state;

    switch (action.type) {
      case 'UNDO': {
        if (undoStack.length === 0) {
          return state;
        }

        const previous = undoStack[undoStack.length - 1];
        const newUndoStack = undoStack.slice(0, undoStack.length - 1);

        return {
          ...previous,
          undoStack: newUndoStack,
          redoStack: [createSnapshot(rest as EditorState), ...redoStack],
        };
      }

      case 'REDO': {
        if (redoStack.length === 0) {
          return state;
        }

        const next = redoStack[0];
        const newRedoStack = redoStack.slice(1);

        return {
          ...next,
          undoStack: [...undoStack, createSnapshot(rest as EditorState)],
          redoStack: newRedoStack,
        };
      }

      default: {
        // Delegate handling the action to the passed reducer
        const newRest = reducer(rest, action);

        // If the state has changed, push the previous state to the undo stack
        if (rest !== newRest) {
          return {
            ...(newRest as EditorState),
            undoStack: [...undoStack, createSnapshot(rest as EditorState)],
            redoStack: [], // Clear the redo stack on new actions
          };
        }

        return state;
      }
    }
  };
};
