import { createStore } from 'redux';
import { editorReducer } from './reducer';

export const store = createStore(editorReducer);
