import { createReducer } from 'redux-starter-kit'
import { add, remove, removeAll, reset } from "./actions";
import { reject } from 'lodash-es'
import { uniqid } from '@ttungbmt/utils'

export const initialState = {
    items: [],
};

export default createReducer(initialState, {
    [add]: (state, {payload}) => {
        state.items.push({id: uniqid(), options: payload})
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

