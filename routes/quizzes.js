const express = require("express");
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
  });

  // Route 2 - POST /quizzes
  router.post("/", (req, res) => {
    //What is important here is to send the quiz details from req.body along with the userId (from the cookie) to the db
    //userId = req.session.userId;
    //Db function that adds a quiz to the db (e.g. addQuiz({userId, ...req.params});
    //Redirect to the user's quizzes i.e. res.redirect("myquizzes.ejs");
    //add a .catch to deal with errors
  });

  //Route 3 - GET /quizzes/new
  router.get("/new", (req, res) => {
    //If a user visiting this page does not have a cookie, redirect to login page.
    //const userId = req.session.userId;
    //If (!userId) res.redirect(/sessions/new)
    //Else res.render("create.ejs", {userId})
  });

  //Route 4 - GET /quizzes/:quizId
  router.get("/:quizId", (req, res) => {
    //If a user has a quiz link and is logged in; the user should be able to view it regardless of whether it is public or private
    //? Does the above statement holds true if the user is not logged in?
    //const userId = req.session.userId;
    //Check if a cookie exists otherwise res.status(403).redirect("/sessions/new")
    //const quiz = req.params.quizId
    //We will need to check via fetchQuiz if the requested quiz exists in our db otherwise return res.status(404).send("resource does not exist")
    //Capture the response and include the userId (for e.g. in templateVars) and return res.render("q_welcome.ejs", templateVars) --> change name to quizzes_show
    //Reminder that stats of that userId needs to be displayed.
  });

  //Route 5 - GET quizzes/:quizId/play
  router.get("/:quizId/play", (req, res) => {
    //The objective of this route is to return the game engine (ejs) along with the data to populate a given session (i.e. associated to a quizID)
    //const userId = req.session.userId - check if user is logged in otherwise redirect to login page
    //const quizId = req.params.quizId - need this to determine which quiz to retrieve from the db (i.e. question, potential answers, correct answer etc.)
    //fetchQuiz(quizId)
    //res.render("q_play.ejs", templateVars) - templateVars will include the quiz Object along with userId
  });

  //Route 6 - GET quizzes/:quizId/json
  router.get("/:quizId/json", (req, res) => {
    //The objective of this route is to send to the FE a json representation of a specific quiz object
    //quizId = req.params.quizId
    //fetchQuiz(quizId)
    //res.json(quizId)
  });

  return router;
};
