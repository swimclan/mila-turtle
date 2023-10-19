import { resolve } from "path";
import express, { type Express } from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import DotEnv from "dotenv";

DotEnv.config();
const app: Express = express();

const compiler = webpack({
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
  mode: process.env.NODE_ENV as "production" | "development",
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

/* STATIC CONTENT DIRECTORY */
app.use(express.static("public"));

/* WEBPACK COMPILE ENGINE */
app.use(
  webpackDevMiddleware(compiler, {
    writeToDisk: true,
  })
);

app.use(require("webpack-hot-middleware")(compiler));

/* VIEW ENGINE */
app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "../views"));

/* ROUTES */
app.get("/", (req, res, next) => {
  res.status(200).render("home", { username: "swimclan" });
});

/* SERVER */
const PORT = process.env.SERVER_PORT || 3030;
app.listen(PORT, () => console.log(`Turtle is running on port ${PORT}`));
