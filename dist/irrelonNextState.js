"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Store = require("./Store");

var _irrelonLog = require("irrelon-log");

var _ProvideState = _interopRequireDefault(require("./ProvideState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
    _inherits(DecisionWrapper, _React$PureComponent);

    function DecisionWrapper() {
      _classCallCheck(this, DecisionWrapper);

      return _possibleConstructorReturn(this, _getPrototypeOf(DecisionWrapper).apply(this, arguments));
    }

    _createClass(DecisionWrapper, [{
      key: "render",
      value: function render() {
        var _this = this;

        if (this.context && this.context.stateStore) {
          // We already have a provider
          log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ") render, we have a context, rendering component..."));
          var stateData = resolveMapping(stateMap, this.context.stateStore, false);
          return _react["default"].createElement(ComponentToWrap, _extends({}, this.props, stateData), this.props.children);
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
          return _react["default"].createElement(ComponentToWrap, _extends({}, _this.props, stateData), _this.props.children);
        }));
      }
    }], [{
      key: "getInitialProps",
      value: function () {
        var _getInitialProps = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var finalProps,
              store,
              stateData,
              _len,
              args,
              _key,
              _args = arguments;

          return regeneratorRuntime.wrap(function _callee$(_context) {
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

                  args[0] = _objectSpread({}, args[0], stateData);

                  if (ComponentToWrap.getInitialProps) {
                    log.debug("DecisionWrapper(".concat(ComponentToWrap.name, ") calling wrapped component ").concat(ComponentToWrap.name, ".getInitialProps()..."));
                    finalProps = _objectSpread({}, ComponentToWrap.getInitialProps.apply(ComponentToWrap, args));
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