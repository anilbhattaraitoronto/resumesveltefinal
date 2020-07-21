const { schema } = require("./schema");
const sqlite3 = require("better-sqlite3");
const DB = new sqlite3("./resumedb.sqlite");

// DB.pragma("foreign_keys=ON");
DB.exec(schema);

module.exports = DB;
