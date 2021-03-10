const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");

// ! List of db helper functions utilized for this router
//fetchUserNameById(userId)
//verifyEmail(email) - check if an email exists - boolean
//verifyUsername(username) - check if a userName exists - boolean
//addUser(newUser)
//getQuizzesByUserId(userId)

/*
  List of users Routes/Endpoints:
  1 - GET /users/new -> Display the registration form
  2 - POST /users -> Creates a new user and is pushed to the db
  3 - GET /users/:userId/quizzes -> List all quizzes associated with a userId (public & private)
  Stretch:
  4 - DELETE /users/:userId/quizzes/quiz:id -> switch is_active to false (soft delete)

*/

module.exports = (db, bcrypt) => {
  //Route 1 - GET /users/new
  router.get("/new", (req, res) => {
    //If a logged in user enters this url then redirects to /quizzes
    const userId = req.session && req.session.userId;
    if (userId) {
      return res.status(302).redirect("/quizzes");
    }
    res.render("./pages/register.ejs");
  });

  //Route 2 - POST /users
  router.post("/", (req, res) => {
    const { username, email, password } = req.body;
    //Check if there are any empty input fields
    if (!email || !password || !username) {
      return res
        .status(400)
        .send("Empty email address, username and/or password field(s)");
    }
    //verifyEmail will check whether an email or exists in the db or not
    //verifyUserName will check whether a userName already exists in the db or not

    const promise1 = db.verifyEmail(email).catch((res) => false);
    const promise2 = db.verifyUserName(username).catch((res) => false);

    //If either the username or email address already exists then send error message
    Promise.all([promise1, promise2]).then((response) => {
      if (!response[0])
        return res.status(400).send("Oops, Email address already exists");
      if (!response[1])
        return res.send.status(400).send("Oops, Username already exists");
    });

    const newUser = {
      email,
      username,
      password: bcrypt.hashSync(password, 10),
    };

    db.addUser(newUser) // ! Need to return the userId so that I can setup the cookie
      .then((response) => {
        req.session.userId = response;
        res.status(302).redirect("/quizzes");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  //Route 3 - GET /:userId/quizzes
  router.get("/:userId/quizzes", (req, res) => {
    //Objective of this route is to return the quizzes created by specific user
    const userId = req.session && req.session.userId;
    if (!userId) {
      return res.status(302).redirect("/sessions/new");
    }

    const promise1 = db.fetchUserNameById(userId);
    const promise2 = db.getQuizzes(userId);

    Promise.all([promise1, promise2])
      .then((response) => {
        const userName = response[0];
        const myQuizzes = response[1];
        const templateVars = { userName, myQuizzes };
        res.render("./pages/myquizzes.ejs", templateVars);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return router;
};
