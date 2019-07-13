import { createReducer } from 'redux-starter-kit'
import { add, remove, removeAll, reset } from "./noty.actions";
import { reject } from 'lodash'
import generateId from 'shortid'

export const initialState = {
    items: [],
};

export default createReducer(initialState, {
    [add]: (state, {payload}) => {
        state.items.push({id: generateId(), options: payload})
    },
    [remove]: (state, {payload: id}) => {
        reject(state.items, {id})
    },
    [removeAll]: (state, {payload: id}) => {
        state.items = []
    },
    [reset]: (state, {payload}) => {
        state = initialState
    },
})

