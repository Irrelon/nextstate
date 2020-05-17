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

var resolveMapping = function resolveMapping(stateMapArr, store) {
  var init = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var componentName = arguments.length > 3 ? arguments[3] : undefined;
  log.debug("(init: ".concat(init, ") Mapping states..."), stateMapArr);
  var stateData = stateMapArr.reduce(function (mapData, stateMap) {
    var stateMapKeys = Object.keys(stateMap);
    log.debug("(init: ".concat(init, ") Mapping state keys:"), JSON.stringify(stateMapKeys));
    stateMapKeys.forEach(function (propName) {
      var mapFunction = stateMap[propName];

      if (!mapFunction) {
        throw new Error("\"irrelonNextState: The prop named \"".concat(propName, "\" in the component \"").concat(componentName, "\" has been passed an undefined value when we expected a state method such as myState.get()"));
      }

      var isStateFunction = mapFunction.__isNextStateStoreFunction;
      log.debug("Mapping ".concat(propName, "..."));

      if (typeof mapFunction !== "function") {
        throw new Error("Mapping prop ".concat(propName, " failed, not provided a function!"));
      }

      if (init && isStateFunction) {
        // Ask state to init
        mapFunction.init(store);
      }

      if (isStateFunction) {
        mapData[propName] = mapFunction(store);
      } else {
        // Pass the existing aggregated mapping to the function
        // and map the return value to the prop
        mapData[propName] = mapFunction(mapData);
      }
    });
    return mapData;
  }, {});
  log.debug("Mapping complete");
  return stateData;
};

var irrelonNextState = function irrelonNextState() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var stateMapArr = args.slice(0, args.length - 1);
  var ComponentToWrap = args[args.length - 1];
  var argSignature = "".concat(ComponentToWrap.name);
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
          var stateData = resolveMapping(stateMapArr, this.context.stateStore, true, ComponentToWrap.name);
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
          var stateData = resolveMapping(stateMapArr, stateContainer.stateStore, false, ComponentToWrap.name);
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
              _len2,
              args,
              _key2,
              pageProps,
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
                  stateData = resolveMapping(stateMapArr, store, true, ComponentToWrap.name);

                  for (_len2 = _args.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = _args[_key2];
                  }

                  args[0] = (0, _objectSpread2["default"])({}, args[0], stateData);

                  if (!ComponentToWrap.getInitialProps) {
                    _context.next = 13;
                    break;
                  }

                  log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ") calling wrapped component ").concat(ComponentToWrap.name, ".getInitialProps()..."));
                  _context.next = 11;
                  return ComponentToWrap.getInitialProps.apply(ComponentToWrap, args);

                case 11:
                  pageProps = _context.sent;
                  finalProps = (0, _objectSpread2["default"])({}, pageProps);

                case 13:
                  finalProps._serverSideState = store.exportData();
                  return _context.abrupt("return", finalProps);

                case 15:
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