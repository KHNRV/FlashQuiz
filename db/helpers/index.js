//index.js -> all of the data helpers flow through this file
const { getQuizzes, getLeaderboard, fetchQuizDetails, fetchQuizQuestions, addQuiz } = require("./quizData");
const { fetchUserNameById, getUserByEmail, verifyUserName, verifyEmail, addUser } = require("./userData");
const { startAttempt, finishAttempt } = require("./attemptData")


const fetchAssembledQuiz = function(params) {
  const { questions, quizId, userId, publicId } = params;
  return "fantastic";
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

// --- test code ---

fetchQuizQuestions(1).then(data=>console.log(data[0]));
fetchQuizQuestions(0).then(data=>console.log(data));



