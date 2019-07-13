import { createSelector } from 'redux-starter-kit'

export const getNoty = createSelector(['noty'], (noty) => noty)
