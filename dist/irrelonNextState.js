"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _Store = require("./Store");

var _irrelonLog = require("irrelon-log");

var _ProvideState = _interopRequireDefault(require("./ProvideState"));

var log = (0, _irrelonLog.init)("irrelonNextState");
var Context = (0, _Store.getContext)();

var resolveMapping = function resolveMapping(stateMap, store) {
  var init = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var stateMapKeys = Object.keys(stateMap);
  var stateData = {};
  log.debug("(init: ".concat(init, ") Mapping state keys:"), JSON.stringify(stateMapKeys));
  stateMapKeys.forEach(function (propName) {
    var stateInstanceFunction = stateMap[propName];
    log.debug("Mapping ".concat(propName, "..."));

    if (typeof stateInstanceFunction !== "function") {
      throw new Error("Cannot map a prop to a state that is not a function!");
    }

    if (init) {
      // Ask state to init
      stateInstanceFunction.init(store);
    }

    stateData[propName] = stateInstanceFunction(store);
  });
  log.debug("Mapping complete");
  return stateData;
};

var irrelonNextState = function irrelonNextState(stateMap, ComponentToWrap) {
  var argSignature = "".concat(JSON.stringify(Object.keys(stateMap)), ", ").concat(ComponentToWrap.name);
  log.debug("irrelonNextState(".concat(argSignature, ")"));

  var DecisionWrapper =
  /*#__PURE__*/
  function (_React$PureComponent) {
    (0, _inherits2["default"])(DecisionWrapper, _React$PureComponent);

    function DecisionWrapper() {
      (0, _classCallCheck2["default"])(this, DecisionWrapper);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DecisionWrapper).apply(this, arguments));
    }

    (0, _createClass2["default"])(DecisionWrapper, [{
      key: "render",
      value: function render() {
        var _this = this;

        if (this.context && this.context.stateStore) {
          // We already have a provider
          log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ") render, we have a context, rendering component..."));
          var stateData = resolveMapping(stateMap, this.context.stateStore, false);
          return _react["default"].createElement(ComponentToWrap, (0, _extends2["default"])({}, this.props, stateData), this.props.children);
        } // We don't have a provider, render one


        log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ") render, we DO NOT have a context, rendering provider..."));

        if (this.props.stateStore) {
          this.stateStore = this.props.stateStore;
        } else {
          this.stateStore = (0, _Store.getStore)(this.props._serverSideState);
        }

        return _react["default"].createElement(_ProvideState["default"], {
          stateStore: this.stateStore
        }, _react["default"].createElement(Context.Consumer, null, function (stateContainer) {
          log.debug("".concat(ComponentToWrap.name, " Provider consumer re-render"));
          var stateData = resolveMapping(stateMap, stateContainer.stateStore, false);
          return _react["default"].createElement(ComponentToWrap, (0, _extends2["default"])({}, _this.props, stateData), _this.props.children);
        }));
      }
    }], [{
      key: "getInitialProps",
      value: function () {
        var _getInitialProps = (0, _asyncToGenerator2["default"])(
        /*#__PURE__*/
        _regenerator["default"].mark(function _callee() {
          var finalProps,
              store,
              stateData,
              _len,
              args,
              _key,
              _args = arguments;

          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  finalProps = {};
                  log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ").getInitialProps() running..."));

                  if (Context.Consumer._currentValue && Context.Consumer._currentValue.stateStore) {
                    log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ").getInitialProps context HAS data, using it..."));
                    store = Context.Consumer._currentValue.stateStore;
                  } else {
                    log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ").getInitialProps context has no data, creating new store..."));
                    store = (0, _Store.getStore)();
                  }

                  log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ").getInitialProps resolving stateData mapping..."));
                  stateData = resolveMapping(stateMap, store, true);

                  for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = _args[_key];
                  }

                  args[0] = (0, _objectSpread2["default"])({}, args[0], stateData);

                  if (ComponentToWrap.getInitialProps) {
                    log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ") calling wrapped component ").concat(ComponentToWrap.name, ".getInitialProps()..."));
                    finalProps = (0, _objectSpread2["default"])({}, ComponentToWrap.getInitialProps.apply(ComponentToWrap, args));
                  }

                  finalProps._serverSideState = store.exportData();
                  return _context.abrupt("return", finalProps);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function getInitialProps() {
          return _getInitialProps.apply(this, arguments);
        }

        return getInitialProps;
      }()
    }]);
    return DecisionWrapper;
  }(_react["default"].PureComponent);

  DecisionWrapper.contextType = Context;
  return DecisionWrapper;
};

var _default = irrelonNextState;
exports["default"] = _default;