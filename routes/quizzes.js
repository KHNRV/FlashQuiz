const express = require("express");
const { fetchQuizDetails, fetchQuizQuestions } = require("../dataHelpers");
const router = express.Router();
// ! require quizzes db helper functions here
// ! List of db helper functions below for this router
//getPublicQuizzes()
//addQuiz({userId, ...req.params})
//fetchQuiz(quizId)

// I will need to import/require the db here unless if I export router within a function preloaded with db as an argument (as currently coded); It reduces redundancy but is less descriptive and intuitive.

/*
  List of quiz Routes/Endpoints:
  1 - GET /quizzes -> List all public quizzes via index.ejs (will need to make a call to DB to retrieve list of quizzes then loop to display in ejs)
  2 - POST /quizzes -> Create a new quiz and push it to db
  3 - GET /quizzes/new -> Display the form to create a new quiz
  4 - GET /quizzes/:quizId -> Display the home page for a specific quiz & associated stats

  ------ Routes 5 & 6 ------
  5 - GET /quizzes/:quizId/play -> Fetches ejs (dynamic html) for the quiz structure/layout i.e. question, 4 answer boxes, timer visible etc.
  6 - GET /quizzes/:quizId/json -> Get the json containing the actual values for a particular quiz i.e. the quiz description, question, answers etc.
  ?  Route 7 i.e. fetching a user's stats on a particular quiz - may not be required.
*/

module.exports = (db) => {
  // Route 1 - Get /quizzes
  router.get("/", (req, res) => {
    // Db function that fetches the public quizzes from the db & returns an array of objects e.g. getPublicQuizzes
    // Capture the returned db data (i.e. the resolved promise response) in a variable (e.g. const publicQuizzes)
    // Insert in templateVars i.e. templateVars = {publicQuizzes} & include in the response
    // res.render("index.ejs", templateVars)
    db.getQuizzes().then((response) => {
      const userId = req.session && res.session.userId; // *TODO Optional chaining
      const publicQuizzes = response;
      const templateVars = { publicQuizzes, userId };
      res.render("./pages/index.ejs", templateVars);
      //TODO: Confirm that the ejs file is indeed index.ejs
    });
  });

  // Route 2 - POST /quizzes
  router.post("/", (req, res) => {
    //What is important here is to send the quiz details from req.body along with the userId (from the cookie) to the db
    //userId = req.session.userId;
    //Db function that adds a quiz to the db (e.g. addQuiz({userId, ...req.body});
    //Redirect to the user's quizzes i.e. res.redirect("myquizzes.ejs");
    //add a .catch to deal with errors
    const userId = req.session && res.session.userId;
    db.addQuiz({ userId, ...req.body })
      .then((response) => {
        res.redirect("/quizzes");
      })
      .catch((error) => console.log(error));
  });

  //Route 3 - GET /quizzes/new
  router.get("/new", (req, res) => {
    //If a user visiting this page does not have a cookie, redirect to login page.
    //const userId = req.session.userId;
    //If (!userId) res.redirect(/sessions/new)
    //Else res.render("create.ejs", {userId})
    const userId = req.session && res.session.userId;
    if (!userId) {
      res.redirect("/sessions/new");
    } else {
      const templateVars = { userId };
      res.render("./pages/create.ejs", templateVars);
    }
  });

  //Route 4 - GET /quizzes/:quizId
  router.get("/:quizId", (req, res) => {
    //If a user has a quiz link and is logged in; the user should be able to view it regardless of whether it is public or private
    //? Does the above statement holds true if the user is not logged in?
    //const userId = req.session.userId;
    //const quiz = req.params.quizId
    //We will need to check via fetchQuizDetails if the requested quiz exists in our db otherwise return res.status(404).send("resource does not exist")
    //Capture the response and include the userId (for e.g. in templateVars) and return res.render("q_welcome.ejs", templateVars) --> change name to quizzes_show
    //Reminder that stats of that userId needs to be displayed.
    const userId = req.session && res.session.userId;
    const quizId = req.params.quizId;
    db.fetchQuizDetails(quizId)
      .then((response) => {
        if (!response) {
          return res.status(404).send("Resource does not exist");
        }
        const quizDetails = response;
        db.getLeaderBoard(quizId).then((response) => {
          const leaderBoard = response;
          const templateVars = { quizDetails, userId, leaderBoard };
          res.render("./pages/q_welcome.ejs", templateVars);
        });
      })
      .catch((error) => console.log(error));
  }); // * Opportunity to use promise.all here!

  //Route 5 - GET quizzes/:quizId/play
  router.get("/:quizId/play", (req, res) => {
    //The objective of this route is to return the game engine (ejs) along with the data to populate a given session (i.e. associated to a quizID)
    //const userId = req.session.userId - check if user is logged in otherwise redirect to login page
    //const quizId = req.params.quizId - need this to determine which quiz to retrieve from the db (i.e. question, potential answers, correct answer etc.)
    //fetchQuizQuestions(quizId)
    //res.render("q_play.ejs", templateVars) - templateVars will include the quiz Object along with userId
    const userId = req.session && res.session.userId;
    const quizId = req.params.quizId;
    if (!userId) {
      return res.status(302).redirect("/sessions/new");
    }
    if (!quizId) {
      return res.status(404).send("Resource does not exist");
    }
    fetchQuizQuestions(quizId)
      .then((response) => {
        if (!response) {
          return res.status(404).send("No questions associated to this quizId");
        }
        const quizQuestions = response;
        const templateVars = { userId, quizQuestions };
        res.render("./pages/q_play.ejs", templateVars);
      })
      .catch((error) => console.log(error));
  });

  //Route 6 - GET quizzes/:quizId/json
  router.get("/:quizId/json", (req, res) => {
    //The objective of this route is to send to the FE a json representation of a specific quiz object
    //quizId = req.params.quizId
    //fetchQuiz(quizId)
    //res.json(quizId)
    const quizId = req.params.quizId;
    fetchQuizQuestions(quizId).then((response) => {
      res.json(response);
    });
  });

  //Route 7 - POST quizzes/:quiz/play

  return router;
};
