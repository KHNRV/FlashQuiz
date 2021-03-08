const express = require("express");
const router = express.Router();
// ! require cookie session npm package here
// ! require sessions db helper functions here
//getUsernameById(userId);
//getUserByEmail(userId);

/*
  List of sessions Routes/Endpoints:
  1 - GET /sessions/new -> Displays the Login page
  2 - POST /sessions -> Creates a new session (i.e. logged in)
  3 - DELETE / sessions -> Deletes the current session (i.e.) - will use method override for this.

  NOTE: We could remove the "s" from sessions
  as there will never be more than a 'session'
  at a time for a user. I left it for consistency reasons
  in relation to the restful convention
*/

module.exports = (db) => {
  //Route 1 - GET /sessions/new
  router.get("/new", (req, res) => {
    //Capture the cookie and get userName here for consistency for the ejs partials
    //const userId = req.session.userId;
    //getUserName(userId) & insert in templateVars
    //res.render("login.ejs", templateVars)
  });

  //Route 2 - POST /sessions
  router.post("/", (req, res) => {
    //If any of the email or userName does not exists in db then adios to 403
    //If email or userName is true then check password
    //If password is valid then redirect to GET /quizzes
    //Else adios to 403 res.status(403).send("Sorry, this password is not valid")
  });

  return router;
};
