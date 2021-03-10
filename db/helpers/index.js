//index.js -> all of the data helpers flow through this file
const { Question } = require('../../public/classes/classes')
const { getQuizzes, getLeaderboard, fetchQuizDetails, fetchQuizQuestions, addQuiz } = require("./quizData");
const { fetchUserNameById, getUserByEmail, verifyUserName, verifyEmail, addUser } = require("./userData");
const { startAttempt, finishAttempt } = require("./attemptData")


const fetchAssembledQuiz = function(params) {
  // an aggregate function that compiles a quiz object based on parameters
  const { questions, quizId, userId, publicId } = params;

  const promiseObject = {};

  const quizPromise = fetchQuizDetails(quizId)
  promiseObject.quiz = quizPromise

  if (questions) {
    const questionsPromise = fetchQuizQuestions(quizId);
    promiseObject.questions = questionsPromise;
  }

  const globalLeaderboardPromise = getLeaderboard(quizId);
  promiseObject.globalLeaderboard = globalLeaderboardPromise;

  if (userId) {
    const personalLeaderboardPromise = getLeaderboard(quizId,userId);
    promiseObject.personalLeaderboard = personalLeaderboardPromise;
  }

  if (publicId) {
    const specifiedLeaderboardPromise = getLeaderboard(quizId, publicId);
    promiseObject.specifiedLeaderboard = specifiedLeaderboardPromise;
  }

  return Promise.all(Object.values(promiseObject)).then((response)=>{
    const keys = Object.keys(promiseObject);
    for (const key of keys) {
      if (key === 'questions') {
        for (const question of response[keys.indexOf('questions')]) {
          response[0].addQuestion(question);
        }
      } else if (key.includes('global')) {
        response[0].addLeaderboard(response[keys.indexOf('globalLeaderboard')],'globalLeaderboard')
      } else if (key.includes('personal')) {
        response[0].addLeaderboard(response[keys.indexOf('personalLeaderboard')],'personalLeaderboard')
      } else if (key.includes('specified')) {
        response[0].addLeaderboard(response[keys.indexOf('specifiedLeaderboard')],'specifiedLeaderboard')
      }
    }
    return response[0];
  });
};
exports.fetchAssembledQuiz = fetchAssembledQuiz;

// --- quiz data ---
exports.getQuizzes = getQuizzes;
exports.getLeaderboard = getLeaderboard;
exports.fetchQuizDetails = fetchQuizDetails;
exports.fetchQuizQuestions = fetchQuizQuestions;
exports.addQuiz = addQuiz;

// --- user data ---
exports.fetchUserNameById = fetchUserNameById;
exports.getUserByEmail = getUserByEmail;
exports.verifyUserName = verifyUserName;
exports.verifyEmail = verifyEmail;
exports.addUser = addUser;


// --- attempt data ---
exports.startAttempt = startAttempt;
exports.finishAttempt = finishAttempt;
