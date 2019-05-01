"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var _default = ProvideState;
exports["default"] = _default;