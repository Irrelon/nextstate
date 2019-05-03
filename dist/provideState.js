"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.provideState = exports.ProvideState = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ProvideState = function ProvideState(props) {
  var ProvidedStates = props.stateArr.reduce(function (PreviousComponent, stateArrItem) {
    if (PreviousComponent === null) {
      return function (stateRenderProps) {
        return _react["default"].createElement(stateArrItem.Provider, null, stateRenderProps.children);
      };
    }

    return function (stateRenderProps) {
      return _react["default"].createElement(stateArrItem.Provider, null, _react["default"].createElement(PreviousComponent, null, stateRenderProps.children));
    };
  }, null);
  return _react["default"].createElement(ProvidedStates, null, props.children);
};

exports.ProvideState = ProvideState;

var provideState = function provideState(stateArr, ComponentToWrap) {
  return (
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(ProvideStateHOC, _React$Component);

      function ProvideStateHOC() {
        _classCallCheck(this, ProvideStateHOC);

        return _possibleConstructorReturn(this, _getPrototypeOf(ProvideStateHOC).apply(this, arguments));
      }

      _createClass(ProvideStateHOC, [{
        key: "render",
        value: function render() {
          return _react["default"].createElement(ProvideState, {
            stateArr: stateArr
          }, _react["default"].createElement(ComponentToWrap, this.props, this.props.children));
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

      return ProvideStateHOC;
    }(_react["default"].Component)
  );
};

exports.provideState = provideState;