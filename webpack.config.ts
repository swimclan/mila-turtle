import webpack from "webpack";
import { resolve } from "path";

export const getConfig = (env: any) => ({
  entry: {
    main: [
      "webpack-hot-middleware/client",
      resolve(__dirname, "../client/index.tsx"),
    ],
  },
  output: {
    path: resolve(__dirname, "../public/js"),
    filename: "[name].bundle.js",
  },
  mode: env.NODE_ENV as "production" | "development",
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
