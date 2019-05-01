"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Log = require("irrelon-log");

var log = new Log("useState");

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
          var stateMapKeys = Object.keys(stateMap);
          var ConsumedStates = stateMapKeys.reduce(function (PreviousComponent, stateName) {
            return function (stateRenderProps) {
              var stateItem = stateMap[stateName];
              var Context = stateItem.context();
              return _react["default"].createElement(Context.Consumer, null, function (stateData) {
                log.info("Consumed context data for ".concat(stateName, " as ").concat(JSON.stringify(stateData)));
                return _react["default"].createElement(PreviousComponent, _extends({}, stateRenderProps, _defineProperty({}, stateName, stateData)), stateRenderProps.children);
              });
            };
          }, ComponentToWrap);
          return _react["default"].createElement(ConsumedStates, null, this.props.children);
        }
      }], [{
        key: "getInitialProps",
        value: function getInitialProps(req) {
          if (ComponentToWrap.getInitialProps) {
            return ComponentToWrap.getInitialProps(req);
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