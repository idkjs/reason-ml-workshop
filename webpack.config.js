const path = require("path");

module.exports = {
  mode: 'development',
  entry: "./lib/js/src/Main.bs.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
