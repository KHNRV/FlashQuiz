const express = require("express");
const { fetchQuizDetails, fetchQuizQuestions } = require("../dataHelpers");
const router = express.Router();

// ! List of db helper functions utilized for this router
//getPublicQuizzes()
//addQuiz({userId, ...req.params})
//fetchAssembledQuiz(quizId, userId, publicId)
//fetchUserNameById()

/*
  List of quiz Routes/Endpoints:
  1 - GET /quizzes -> List all public quizzes via index.ejs (will need to make a call to DB to retrieve list of quizzes then loop to display in ejs)
  2 - POST /quizzes -> Create a new quiz and push it to db
  3 - GET /quizzes/new -> Display the form to create a new quiz
  4 - GET /quizzes/:quizId -> Display the home page for a specific quiz & associated stats

  ------ Routes 5 & 6 ------
  5 - GET /quizzes/:quizId/play -> Fetches ejs (dynamic html) for the quiz structure/layout i.e. question, 4 answer boxes, timer visible etc.
  6 - GET /quizzes/:quizId/json  (CLI Stretch)-> Get the json containing the actual values for a particular quiz i.e. the quiz description, question, answers etc.
*/

module.exports = (db) => {
  // Route 1 - Get /quizzes
  router.get("/", (req, res) => {
    const userId = req.session && req.session.userId; // *TODO Optional chaining
    const promise1 = db.fetchUserNameById(userId);
    const promise2 = db.getQuizzes();
    Promise.all([promise1, promise2])
      .then((response) => {
        const userName = response[0];
        const publicQuizzes = response[1];
        const templateVars = { userName, publicQuizzes };
        res.render("./pages/index.ejs", templateVars);
      })
      .catch((error) => console.log(error));
  });

  // Route 2 - POST /quizzes
  router.post("/", (req, res) => {
    const userId = req.session && req.session.userId;
    if (!userId) {
      return res.status(401).redirect("/sessions/new");
    }
    db.addQuiz({ userId, ...req.body })
      .then((response) => {
        res.redirect("/quizzes");
      })
      .catch((error) => console.log(error));
  });

  //Route 3 - GET /quizzes/new
  router.get("/new", (req, res) => {
    const userId = req.session && req.session.userId;

    if (!userId) {
      res.redirect("/sessions/new");
    } else {
      db.fetchUserNameById(userId)
        .then((response) => {
          const userName = response;
          const templateVars = { userName };
          res.render("./pages/create.ejs", templateVars);
        })
        .catch((error) => console.log(error));
    }
  });

  //Route 4 - GET /quizzes/:quizId
  router.get("/:quizId/:publicId?", (req, res) => {
    //If a user has a quiz link and is logged in; the user should be able to view it regardless of whether it is public or private
    const userId = req.session && req.session.userId;
    const quizId = req.params.quizId;
    const publicId = req.params && req.params.publicId;

    const promise1 = db.fetchAssembledQuiz(quizId, userId, publicId);
    const promise2 = db.fetchUserNameById(userId);

    Promise.all([promise1, promise2])
      .then((response) => {
        const quiz = response[0];
        const userName = response[1];
        const templateVars = { quiz, userName };
        res.render("./pages/q_welcome.ejs", templateVars);
      })
      .catch((error) => console.log(error));
  });

  //Route 5 - GET quizzes/:quizId/play
  router.get("/:quizId/play", (req, res) => {
    //The objective of this route is to return the game engine (ejs) along with the data to populate a given session (i.e. associated to a quizID)
    const userId = req.session && req.session.userId;
    const quizId = req.params.quizId;
    if (!userId) {
      return res.status(302).redirect("/sessions/new");
    }
    if (!quizId) {
      return res.status(404).send("Resource does not exist");
    }
    db.fetchAssembledQuiz(quizId, userId)
      .then((response) => {
        if (!response) {
          return res
            .status(404)
            .send("No quiz instance associated to this quizId");
        }
        const quiz = response;
        const templateVars = { quiz };
        res.render("./pages/q_play.ejs", templateVars);
      })
      .catch((error) => console.log(error));
  });

  //Route 6 - GET quizzes/:quizId/json
  router.get("/:quizId/json", (req, res) => {
    //The objective of this route is to send to the FE a json representation of a specific quiz object
    const quizId = req.params.quizId;
    fetchQuizQuestions(quizId).then((response) => {
      res.json(response);
    });
  });

  return router;
};
