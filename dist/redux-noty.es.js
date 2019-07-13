import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { createAction, createSelector, createReducer } from 'redux-starter-kit';
import { compose } from 'redux';
import EventEmitter from 'eventemitter3';
import { isPlainObject, isString, includes, reject } from 'lodash-es';
import NotyLib from 'noty';
import { uniqid } from '@ttungbmt/utils';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var reset = createAction('noty/RESET');
var add = createAction('noty/ADD');
var remove = createAction('noty/REMOVE');
var removeAll = createAction('noty/REMOVE_ALL');
var success = function success(opts) {
  return add(opts);
};

var actions = /*#__PURE__*/Object.freeze({
  reset: reset,
  add: add,
  remove: remove,
  removeAll: removeAll,
  success: success
});

var emitter = new EventEmitter();

var addToNoty = function addToNoty(type, payload) {
  return emitter.emit(add.type, payloadToOpts(type, payload));
};

var actions$1 = {};
['alert', 'message', 'success', 'info', 'warning', 'error'].forEach(function (type) {
  actions$1[type] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return addToNoty(type, args);
  };
});

actions$1.removeAll = function () {
  return emitter.emit(removeAll.type);
};

var bus = emitter;

function getTimeout(type) {
  switch (type) {
    case 'message':
      return 0;

    case 'success':
      return 1000;

    case 'info':
      return 2000;

    case 'warning':
      return 3000;

    case 'error':
      return false;

    default:
      return 3000;
  }
}

function payloadToOpts(type, p) {
  var title,
      text,
      options = {
    timeout: getTimeout(type)
  };

  if (p.length === 1) {
    if (isPlainObject(p[0])) options = p[0];
    if (isString(p[0])) text = p[0];
  } else if (p.length === 2) {
    if (isPlainObject(p[1])) {
      text = p[0];
      options = Object.assign({}, p[1]);
    }

    if (isString(p[1])) {
      title = p[0];
      text = p[1];
    }
  } else if (p.length === 3) {
    title = p[0];
    text = p[1];
    options = Object.assign({}, p[2]);
  }

  if (title) options.title = title;
  if (text) options.text = text;
  if (includes(['alert', 'success', 'warning', 'error', 'info'], type)) options.type = type;
  return options;
}

function getOptions(opts) {
  var options = Object.assign({}, {
    theme: 'sunset'
  }, opts);
  if (options.title) options.text = "<div class=\"font-weight-semibold noty-title\">".concat(options.title, "</div><div class=\"noty-text\">").concat(options.text, "</div>");
  return options;
}

function Item(_ref) {
  var id = _ref.id,
      remove = _ref.remove,
      options = _ref.options;
  var el = new NotyLib(getOptions(options));
  useEffect(function () {
    el.on('onClick', function () {
      remove(id);
    }).show();
    return function () {
      el.close();
    };
  }, [id]);
  return null;
}

function Noty(_ref2) {
  var add$1 = _ref2.add,
      remove = _ref2.remove,
      removeAll$1 = _ref2.removeAll,
      reset = _ref2.reset,
      items = _ref2.items;
  useEffect(function () {
    bus.on(add.type, function (payload) {
      return add$1(payload);
    });
    bus.on(removeAll.type, function () {
      NotyLib.closeAll();
      removeAll$1();
    });
    return function () {
      bus.removeListener(add.type);
    };
  }, []);
  return React.createElement(React.Fragment, null, items.map(function (i, k) {
    return React.createElement(Item, _extends({
      key: k,
      remove: remove
    }, i));
  }));
}

var mapStateToProps = function mapStateToProps(state) {
  return {
    items: state.noty.items
  };
};

var mapDispatchToProps = actions;
var withConnect = connect(mapStateToProps, mapDispatchToProps);
var Noty$1 = compose(withConnect, memo)(Noty);

var getNoty = createSelector(['noty'], function (noty) {
  return noty;
});

var selectors = /*#__PURE__*/Object.freeze({
  getNoty: getNoty
});

var _createReducer;
var initialState = {
  items: []
};
var reducer = createReducer(initialState, (_createReducer = {}, _defineProperty(_createReducer, add, function (state, _ref) {
  var payload = _ref.payload;
  state.items.push({
    id: uniqid(),
    options: payload
  });
}), _defineProperty(_createReducer, remove, function (state, _ref2) {
  var id = _ref2.payload;
  reject(state.items, {
    id: id
  });
}), _defineProperty(_createReducer, removeAll, function (state, _ref3) {
  var id = _ref3.payload;
  state.items = [];
}), _defineProperty(_createReducer, reset, function (state, _ref4) {
  var payload = _ref4.payload;
}), _createReducer));

export default Noty$1;
export { actions, actions$1 as noty, reducer, selectors as selector };
