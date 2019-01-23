"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisplayName = exports.mapToStateData = exports.pathSolver = void 0;

var _irrelonPath = _interopRequireDefault(require("irrelon-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pathSolver = new _irrelonPath.default();
exports.pathSolver = pathSolver;

var mapToStateData = function mapToStateData(obj) {
  var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var debugLog = arguments.length > 2 ? arguments[2] : undefined;
  return Object.keys(obj).reduce(function (acc, key) {
    acc[key] = overrides[key] || obj[key].value();
    obj[key].debugLog("(mapToStateData) Mapping \"".concat(key, "\" to value ").concat(JSON.stringify(acc[key])));
    return acc;
  }, {});
};

exports.mapToStateData = mapToStateData;

var getDisplayName = function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

exports.getDisplayName = getDisplayName;