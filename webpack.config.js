const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'nr-server/data/jrgen-editor'),
    filename: 'index.js',
    library:'jrgen'
  },
  resolve: {
    fallback: {

    }
  }
  }

