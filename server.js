const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionStore = require("connect-sqlite3")(session);
const { SECRETS } = require("./secrets");
const path = require("path");

const DB = require("./database/createdb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));
app.use(cors());
app.use(morgan("tiny"));

app.use(session({
  store: new sessionStore(),
  secret: SECRETS.session_secret,
  saveUninitialized: false,
  resave: false,
}));

//import routes

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

//user apis
app.use("/api/users", userRoutes);

//post apis

app.use("/api/posts", postRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/public"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "public", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
