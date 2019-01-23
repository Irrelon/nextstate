"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Wraps the given component in a HOC that controls the props for the wrapped
 * component based on the stateControllerMap object passed in.
 * @param {Object} stateControllerMap The object containing the key value pairs
 * used to create props on the wrapped component. Each key becomes the prop name
 * used to access the value (state controller) data.
 * @param {React.Component} ComponentToWrap The react component to wrap in this
 * HOC so that it will receive new props when state data changes.
 * @returns {{$$typeof, render}} The new HOC.
 */
var useProps = function useProps(stateControllerMap, ComponentToWrap) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var IrrelonNextStateHOC =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(IrrelonNextStateHOC, _React$Component);

    _createClass(IrrelonNextStateHOC, null, [{
      key: "getInitialProps",
      value: function getInitialProps(ctx) {
        if (ComponentToWrap.getInitialProps) {
          return ComponentToWrap.getInitialProps(ctx).then(function (dataProps) {
            if (options.debug) {
              console.log("NextState useProps :: (getInitialProps) Asking to map state controller data to props...");
            }

            return _objectSpread({}, dataProps, (0, _utils.mapToStateData)(stateControllerMap));
          });
        } else {
          return (0, _utils.mapToStateData)(stateControllerMap);
        }
      }
    }]);

    function IrrelonNextStateHOC(props) {
      var _this;

      _classCallCheck(this, IrrelonNextStateHOC);

      _this = _possibleConstructorReturn(this, (IrrelonNextStateHOC.__proto__ || Object.getPrototypeOf(IrrelonNextStateHOC)).call(this, props));

      _this.debugLog('(constructor) Asking to map state controller data to props...');

      _this._changeHandlers = _this._changeHandlers || {};
      _this.state = _objectSpread({}, (0, _utils.mapToStateData)(stateControllerMap, _this.props));
      return _this;
    }

    _createClass(IrrelonNextStateHOC, [{
      key: "debugLog",
      value: function debugLog(msg) {
        if (options.debug) {
          console.log("NextState useProps :: ".concat(msg));
        }
      }
    }, {
      key: "componentWillMount",
      value: function componentWillMount() {
        var _this2 = this;

        // Only hook changes client-side
        if (process && process.browser) {
          this.debugLog('(componentWillMount) Generating state event listeners...');
          Object.keys(stateControllerMap).forEach(function (key) {
            _this2._changeHandlers[key] = _this2.generateHandleChangeByKey(_this2, key, stateControllerMap[key]);
            stateControllerMap[key].debugLog("(componentWillMount) Hooking state change event for prop \"".concat(key, "\""));
            stateControllerMap[key].on('change', _this2._changeHandlers[key]);
          });
          return;
        }

        this.debugLog('(componentWillMount) Event listeners not generated because we are running server-side');
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this3 = this;

        // Only un-hook changes client-side
        if (process && process.browser) {
          Object.keys(stateControllerMap).forEach(function (key) {
            stateControllerMap[key].debugLog("(componentWillUnmount) Unhooking state change event for prop \"".concat(key, "\""));
            stateControllerMap[key].off('change', _this3._changeHandlers[key]);
          });
        }
      }
    }, {
      key: "generateHandleChangeByKey",
      value: function generateHandleChangeByKey(componentInstance, key, stateController) {
        stateController.debugLog("(generateHandleChangeByKey) Generating state change event handler for prop \"".concat(key, "\""));
        return function changeHandler() {
          stateController.debugLog("(changeHandler) Updating prop \"".concat(key, "\" to ").concat(JSON.stringify(stateController.value())));
          componentInstance.setState(_defineProperty({}, key, stateController.value()));
        };
      }
    }, {
      key: "render",
      value: function render() {
        var _props = this.props,
            forwardedRef = _props.forwardedRef,
            otherProps = _objectWithoutProperties(_props, ["forwardedRef"]);

        return _react.default.createElement(ComponentToWrap, _extends({
          ref: forwardedRef
        }, otherProps, this.state));
      }
    }]);

    return IrrelonNextStateHOC;
  }(_react.default.Component);

  IrrelonNextStateHOC.displayName = "IrrelonNextStateHOC(".concat((0, _utils.getDisplayName)(ComponentToWrap), ")");
  return IrrelonNextStateHOC;
};

var _default = useProps;
exports.default = _default;