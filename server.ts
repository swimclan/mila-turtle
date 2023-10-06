import { resolve } from "path";
import express, { type Express } from "express";
import DotEnv from "dotenv";

DotEnv.config();
const app: Express = express();

/* STATIC CONTENT DIRECTORY */
app.use(express.static("public"));

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
