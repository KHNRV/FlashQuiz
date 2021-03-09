const express = require("express");
const { fetchQuizDetails, fetchQuizQuestions } = require("../dataHelpers");
const router = express.Router();

// ! List of db helper functions below for this router
//getPublicQuizzes()
//addQuiz({userId, ...req.params})
//fetchQuiz(quizId)
//! fetchUserNameById()

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

// ! I realized that I need to get the username from db using userId (that I collect from the cookie) - for ejs partials.
module.exports = (db) => {
  // Route 1 - Get /quizzes
  router.get("/", (req, res) => {
    const userId = req.session && req.session.userId; // *TODO Optional chaining

    const promise1 = db.fetchUserNameById(userId).catch((error) => 5);
    const promise2 = db.getQuizzes();
    Promise.all([promise1, promise2])
      .then((response) => {
        const userName = response[0];
        const publicQuizzes = response[1];
        const templateVars = { userName, publicQuizzes };
        res.render("./pages/index.ejs", templateVars);
      })
      .catch((error) => console.log(error));

    // db.fetchUserNameById(userId).then((response) => {
    //   const userName = response;

    //   db.getQuizzes().then((response) => {
    //     const publicQuizzes = response;
    //     const templateVars = { publicQuizzes, userName };
    //     res.render("./pages/index.ejs", templateVars);

    //     //TODO: Confirm that the ejs file will indeed remain index.ejs
    //   });
    // });
  });

  // Route 2 - POST /quizzes
  router.post("/", (req, res) => {
    const userId = req.session && req.session.userId;
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
    // ! Leaderboard --> leaderboard involves the personal score or includes everyone's (personal vs global);
    const userId = req.session && req.session.userId;
    const quizId = req.params.quizId;
    db.fetchQuizDetails(quizId)
      .then((response) => {
        if (!response) {
          return res.status(404).send("Resource does not exist");
        }
        const quizDetails = response;
        db.getLeaderBoard(quizId).then((response) => {
          // add return potentially
          const leaderBoard = response;
          const templateVars = { quizDetails, userId, leaderBoard }; // ! quiz object will contain info called quizDetails/ leadeboard gone
          res.render("./pages/q_welcome.ejs", templateVars); // TODO: send to kevin -> quiz description, globalleaderboard, if(userId) --> personal leaderboard, username
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
    const userId = req.session && req.session.userId;
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
        const templateVars = { userId, quizQuestions }; // todo: userName, quiz -> questions, answers,
        res.render("./pages/q_play.ejs", templateVars); // ! consistency in terms of the quiz class
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
  //Route 8 - get back the personal record

  return router;
};
