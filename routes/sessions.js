const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
// ! List of db helper functions utilized for this router
////getUsernameById(userId);
//getUserByEmail(email); returns a user object containing username, email, userId and password

/*
  List of sessions Routes/Endpoints:
  1 - GET /sessions/new -> Displays the Login page
  2 - POST /sessions -> Creates a new session (i.e. logged in)
  3 - DELETE / sessions -> Deletes the current session (i.e. logout) - will use method override for this.

  NOTE: We could remove the "s" from sessions
  as there will never be more than a 'session'
  at a time for a user. I left it for consistency reasons
  in relation to the restful convention
*/

module.exports = (db, bcrypt) => {
  //Route 1 - GET /sessions/new
  router.get("/new", (req, res) => {
    const userId = req.session && req.session.userId;
    //If a logged in user enters this url then redirects to /quizzes
    if (userId) {
      return res.status(302).redirect("/quizzes");
    }
    res.render("./pages/login.ejs");
  });

  //Route 2 - POST /sessions
  router.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.getUserByEmail(email).then((response) => {
      //response is a user object containing username, email, userId and password
      //If email does not exists in db then adios to 302
      if (!response && response.email) {
        return res.status(403).send("Sorry, this email does not exist");
      }
      //If email is true then check password
      //If password is valid then redirect to GET /quizzes
      if (bcrypt.compareSync(password, response.password)) {
        req.session.userId = response.id;
        res.redirect("/quizzes");
      } else {
        //else return wrong password & adios to 403
        return res.status(403).send("Sorry, this password is not valid");
      }
    });
  });
  //Route 3 - DELETE /sessions
  router.delete("/", (req, res) => {
    //method override will be used for this
    // clear cookies session then redirect
    req.session.userId = null;
    res.redirect("/quizzes");
  });

  return router;
};
