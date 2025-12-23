import { createStore } from 'redux';
import { editorReducer } from './reducer';
import { undoable } from './undoable';

export const store = createStore(undoable(editorReducer));
