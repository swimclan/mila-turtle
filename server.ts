import { resolve } from "path";
import express, { type Express } from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import DotEnv from "dotenv";
import { getConfig } from "./webpack.config";

DotEnv.config();
const app: Express = express();

const compiler = webpack(getConfig(process.env));

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
