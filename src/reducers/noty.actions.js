import { createAction } from "redux-starter-kit";

export const reset = createAction('noty/RESET')

export const add = createAction('noty/ADD')
export const remove = createAction('noty/REMOVE')
export const removeAll = createAction('noty/REMOVE_ALL')

export const success = (opts) => add(opts)
