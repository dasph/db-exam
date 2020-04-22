module.exports = [{
  mode: process.env.NODE_ENV || 'development',
  entry: './app/index.js',
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: { presets: [['@babel/env', { targets: { node: 'current' } }], '@babel/react'] }
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader?url=false']
    }]
  }
}]
