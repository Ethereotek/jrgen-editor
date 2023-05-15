const path = require('path')
// const webpack = require('webpack')
module.exports = {
  entry: '/src/index.js',
  output: {
    path: path.resolve(__dirname, 'src/nr-server/jrgen-editor'),
    filename: 'index.js',
    library: 'jrgen'
  }
}

