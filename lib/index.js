"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapToStateData = exports.useProps = exports.StateController = void 0;

var _irrelonEmitter = _interopRequireDefault(require("irrelon-emitter"));

var _irrelonPath = _interopRequireDefault(require("irrelon-path"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pathSolver = new _irrelonPath.default();
/**
 * The StateController class manages states including their data
 * and mutations.
 */

var StateController =
/*#__PURE__*/
function () {
  function StateController(data) {
    _classCallCheck(this, StateController);

    this._data = data;
  }

  _createClass(StateController, [{
    key: "update",
    value: function update(data) {
      if (!Object.is(this._data, data)) {
        if (_typeof(this._data) === 'object' && _typeof(data) === 'object') {
          // Mixin existing data
          this._data = _objectSpread({}, this._data, data);
        } else {
          this._data = data;
        }

        this.emit('change');
      }
    }
  }, {
    key: "overwrite",
    value: function overwrite(data) {
      if (!Object.is(this._data, data)) {
        this._data = data;
        this.emit('change');
      }
    }
  }, {
    key: "value",
    value: function value() {
      return this._data;
    }
  }, {
    key: "find",
    value: function find(query, options) {
      return this._data;
    }
  }, {
    key: "get",
    value: function get(path) {
      return pathSolver.get(this._data, path);
    }
  }]);

  return StateController;
}(); // Give StateController's prototype the event emitter methods
// and functionality


exports.StateController = StateController;
(0, _irrelonEmitter.default)(StateController);

var mapToStateData = function mapToStateData(obj) {
  var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.keys(obj).reduce(function (acc, key) {
    acc[key] = overrides[key] || obj[key].find();
    return acc;
  }, {});
};
/**
 * Wraps the given component in a HOC that controls the props for the wrapped
 * component based on the stateControllerMap object passed in.
 * @param {Object} stateControllerMap The object containing the key value pairs
 * used to create props on the wrapped component. Each key becomes the prop name
 * used to access the value (state controller) data.
 * @param {React.Component} ComponentToWrap The react component to wrap in this
 * HOC so that it will receive new props when state data changes.
 * @returns {Class<React.Component>} The new HOC.
 */


exports.mapToStateData = mapToStateData;

var useProps = function useProps(stateControllerMap, ComponentToWrap) {
  return (
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(IrrelonNextStateHOC, _React$Component);

      _createClass(IrrelonNextStateHOC, null, [{
        key: "getInitialProps",
        value: function getInitialProps(ctx) {
          if (ComponentToWrap.getInitialProps) {
            return ComponentToWrap.getInitialProps(ctx).then(function (dataProps) {
              return _objectSpread({}, dataProps, mapToStateData(stateControllerMap));
            });
          } else {
            return mapToStateData(stateControllerMap);
          }
        }
      }]);

      function IrrelonNextStateHOC(props) {
        var _this;

        _classCallCheck(this, IrrelonNextStateHOC);

        _this = _possibleConstructorReturn(this, (IrrelonNextStateHOC.__proto__ || Object.getPrototypeOf(IrrelonNextStateHOC)).call(this, props));
        _this._changeHandlers = {};
        _this.state = _objectSpread({}, mapToStateData(stateControllerMap, props));
        return _this;
      }

      _createClass(IrrelonNextStateHOC, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          Object.keys(stateControllerMap).forEach(function (key) {
            _this2._changeHandlers[key] = _this2.generateHandleChangeByKey(_this2, key, stateControllerMap[key]);
            stateControllerMap[key].on('change', _this2._changeHandlers[key]);
          });
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var _this3 = this;

          Object.keys(stateControllerMap).forEach(function (key) {
            stateControllerMap[key].off('change', _this3._changeHandlers[key]);
          });
        }
      }, {
        key: "generateHandleChangeByKey",
        value: function generateHandleChangeByKey(componentInstance, key, stateController) {
          return function () {
            componentInstance.setState(_defineProperty({}, key, stateController.find()));
          };
        }
      }, {
        key: "render",
        value: function render() {
          return _react.default.createElement(ComponentToWrap, _extends({}, this.props, this.state));
        }
      }]);

      return IrrelonNextStateHOC;
    }(_react.default.Component)
  );
};

exports.useProps = useProps;