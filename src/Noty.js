import React, { memo, useEffect } from 'react'
import { connect } from "react-redux";
import * as actions from './reducers/actions';
import { compose } from "redux";
import { bus } from './emitter'

import NotyLib from 'noty'
import 'noty/lib/noty.css'
import 'noty/lib/themes/sunset.css'

function getOptions(opts) {
    let options = Object.assign({}, {theme: 'sunset'}, opts)
    if (options.title) options.text = `<div class="font-weight-semibold noty-title">${options.title}</div><div class="noty-text">${options.text}</div>`
    return options
}

function Item({id, remove, options}) {
    const el = new NotyLib(getOptions(options))

    useEffect(() => {
        el.on('onClick', function () {
            remove(id)
        }).show()

        return () => {
            el.close()
        }
    }, [id])

    return null
}

function Noty({add, remove, removeAll, reset, items}) {
    useEffect(() => {
        bus.on(actions.add.type, (payload) => add(payload))
        bus.on(actions.removeAll.type, () => {
            NotyLib.closeAll()
            removeAll()
        })

        return () => {
            bus.removeListener(actions.add.type);
        }
    }, [])

    return (
        <>
            {items.map((i, k) => <Item key={k} remove={remove} {...i}/>)}
        </>
    )
}


const mapStateToProps = (state) => ({items: state.noty.items})
const mapDispatchToProps = actions
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
    withConnect,
    memo
)(Noty);
