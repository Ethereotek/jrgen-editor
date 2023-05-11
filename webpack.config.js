const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
	  "http":false,
	  "https":false
    }
  }
}
