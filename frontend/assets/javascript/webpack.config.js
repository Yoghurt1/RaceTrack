const path = require('path');

function bundleFile(file) {
  return path.join(__dirname, file);
}

module.exports = {
  entry: {
    eventSentiment: bundleFile('/eventSentiment.js'),
    eventVisualise: bundleFile('/eventVisualise.js')
  },
  output: {
    path: path.join(__dirname, '../../public/javascripts/'),
    filename: '[name].js'
  },
  devtool: 'source-map'
};
