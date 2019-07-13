import EventEmitter from 'eventemitter3'
import * as acts from './noty.actions'
import { isPlainObject, isString, clone, includes } from 'lodash'

export const emitter = new EventEmitter()

const addToNoty = (type, payload) => emitter.emit(acts.add.type, payloadToOpts(type, payload))

let actions = {};

['alert', 'message', 'success', 'info', 'warning', 'error'].forEach(type => {
    actions[type] = (...args) => addToNoty(type, args);
})

actions.removeAll = () => emitter.emit(acts.removeAll.type);

export const bus = emitter
export default actions

function getTimeout(type) {
    switch (type){
        case 'message': return 0
        case 'success': return 1000
        case 'info': return 2000
        case 'warning': return 3000
        case 'error': return false
        default: return 3000
    }
}

function payloadToOpts(type, p) {
    let title, text, options = {
        timeout: getTimeout(type),
    }

    if (p.length === 1) {
        if(isPlainObject(p[0])) options = p[0]
        if(isString(p[0])) text = p[0]
    } else if(p.length === 2){
        if(isPlainObject(p[1])) {
            text = p[0]
            options = Object.assign({}, p[1])
        }

        if(isString(p[1])){
            title = p[0]
            text = p[1]
        }

    } else if(p.length === 3){
        title = p[0]
        text = p[1]
        options = Object.assign({}, p[2])
    }

    if(title) options.title = title
    if(text) options.text = text
    if(includes(['alert', 'success', 'warning', 'error', 'info'], type)) options.type = type

    return options
}