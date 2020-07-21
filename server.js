const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionStore = require("connect-sqlite3")(session);
const { SECRETS } = require("./secrets");

const DB = require("./database/createdb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "2mb", extended: false }));

app.use(session({
  store: new sessionStore(),
  secret: SECRETS.session_secret,
  saveUninitialized: false,
  resave: false,
}));

//import routes

const userRoutes = require("./routes/userRoutes");
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
