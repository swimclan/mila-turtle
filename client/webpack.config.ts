import path from "path";

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./index.tsx"),
  },
  output: {
    path: path.resolve(__dirname, "../public/js"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
