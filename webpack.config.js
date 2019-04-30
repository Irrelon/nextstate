module.exports = {
	"entry": "./src/index.js",
	"module": {
		"rules": [{
			"test": /\.(js|jsx)$/,
			"exclude": /node_modules/,
			"loader": "babel-loader"
		}]
	},
	"mode": "development",
	"target": "web",
	"output": {
		"libraryTarget": "commonjs"
	}
};