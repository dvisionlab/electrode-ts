const path = require("path");
const { merge } = require("webpack-merge");
const commonConfiguration = require("./webpack.common.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

console.log("dirname", __dirname);

module.exports = merge(commonConfiguration, {
  entry: path.resolve(__dirname, "../src/index.ts"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "electrode.js",
    library: "electrode",
    libraryTarget: "umd"
  },
  mode: "production",
  plugins: [new CleanWebpackPlugin()]
});
