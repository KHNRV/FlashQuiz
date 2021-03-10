//! Nick: "I refactored how the pool is required through database.js so that the dataHelpers can be more easily tested and required."
const db = require("./dataHelpers");

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");

//MethodOverride middleware using a query value
app.use(methodOverride("_method"));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const quizzesRoutes = require("./routes/quizzes");
const sessionsRoutes = require("./routes/sessions");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/users", usersRoutes(db, bcrypt));
app.use("/quizzes", quizzesRoutes(db));
app.use("/sessions", sessionsRoutes(db, bcrypt));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.redirect("/quizzes"); // ? We could redirect to api/quizzes - it would be equivalent.
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
