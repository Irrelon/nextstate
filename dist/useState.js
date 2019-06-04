"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Store = require("./Store");

var _irrelonLog = require("irrelon-log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var log = (0, _irrelonLog.init)("useState");

var useState = function useState(stateMap, ComponentToWrap) {
  return (
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(UseStateHOC, _React$Component);

      function UseStateHOC() {
        _classCallCheck(this, UseStateHOC);

        return _possibleConstructorReturn(this, _getPrototypeOf(UseStateHOC).apply(this, arguments));
      }

      _createClass(UseStateHOC, [{
        key: "render",
        value: function render() {
          var _this = this;

          var Context = (0, _Store.getContext)();

          if (!Context) {
            log.warn("Attempted to use state but no ProvideState was found in the upper tree nodes!");
            return _react["default"].createElement(ComponentToWrap, this.props);
          }

          return _react["default"].createElement(Context.Consumer, null, function (store) {
            if (!store) {
              return _react["default"].createElement(ComponentToWrap, _this.props, _this.props.children);
            }

            var stateMapKeys = Object.keys(stateMap);
            var stateData = {};
            log.debug('Mapping state keys:', JSON.stringify(stateMapKeys));
            stateMapKeys.forEach(function (propName) {
              var stateName = stateMap[propName];

              if (typeof stateName !== "string") {
                throw new Error("Cannot map a state object to a prop name that is not a string!");
              }

              log.debug("Assigning state ".concat(stateName, " to prop ").concat(propName));
              stateData[propName] = store.get(stateName);
            }); // Add the store to the prop "stateStore"

            stateData.stateStore = store;
            log.debug('Passing state data to component:', JSON.stringify(stateData));
            return _react["default"].createElement(ComponentToWrap, _extends({}, _this.props, stateData), _this.props.children);
          });
        }
      }], [{
        key: "getInitialProps",
        value: function getInitialProps(ctx) {
          if (ComponentToWrap.getInitialProps) {
            return ComponentToWrap.getInitialProps(ctx);
          } else {
            return {};
          }
        }
      }]);

      return UseStateHOC;
    }(_react["default"].Component)
  );
};

var _default = useState;
exports["default"] = _default;