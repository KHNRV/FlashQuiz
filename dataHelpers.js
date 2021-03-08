//TODO: add error handling to all dataHelpers.methods

const db = require('./db/pool.js');

//TODO: REFACTOR THIS LATER
/**
 * Recreating the function that came with the skeleton
 * @returns {object} raw query response object
 */
const users = function() {
  return db.query('SELECT * FROM users;')
};
exports.users = users;

/**
 * Get all public quizzes, or a specific users public and private quizzes
 * @param {number} user_id -  optional
 * @returns {array} query response rows
 */
const getQuizzes = function(user_id) {
  let queryString = `
    SELECT quizzes.id AS id,
    users.name AS creator,
    title,
    description
    FROM quizzes
    JOIN users ON owner_id = users.id
    WHERE is_active IS TRUE
  `;
  if (user_id) {
    queryString += `AND owner_id = $1;`
    queryParams = [user_id];
  } else {
    queryString += `AND is_public = $1;`;
    queryParams = ['TRUE'];
  }
  return db
    .query(queryString, queryParams)
    .then(res => res.rows);
};
exports.getQuizzes = getQuizzes;

/**
 * Get the leader board for a specific quiz
 * @param {number} quiz_id - mandatory
 * @returns {array} an array of attempts ordered by score descending
 */
const getLeaderBoard = function(quiz_id) {

  const queryParams = [quiz_id];
  const queryString = `
  SELECT name,
  concat(num_correct * 100 / total_questions, '%') AS accuracy,
  duration AS time,
  num_correct * (0.8 + (1000000 - (date_part('microsecond', (duration) / max_duration))))/1000 AS computed_score
  FROM (
    SELECT
    attempts.id,
    name,
    end_time - start_time AS duration,
    SUM(questions.time_limit / 1000) max_duration,
    num_correct,
    COUNT(questions.*) AS total_questions
    FROM attempts
    JOIN quizzes ON attempts.quiz_id = quizzes.id
    JOIN questions ON questions.quiz_id = quizzes.id
    JOIN users ON attempts.user_id = users.id
    WHERE end_time IS NOT NULL AND quizzes.id = $1
    GROUP BY attempts.id, name, end_time - start_time, num_correct
  ) AS query
  ORDER BY computed_score DESC;
  `;
  return db
    .query(queryString,queryParams)
    .then(res => res.rows);

};
exports.getLeaderBoard = getLeaderBoard;

/**
 * Insert an attempt into the attempts table
 * @param {number} quiz_id - mandatory
 * @param {number} user_id - mandatory
 * @returns {object} attempt_id
 */
const startAttempt = function(quiz_id, user_id) {

  const queryParams = [quiz_id, user_id];
  const queryString = `INSERT INTO attempts (quiz_id, user_id) VALUES ($1,$2) RETURNING *;`;
  return db
  .query(queryString, queryParams)
  .then ((res) => {
    return { 'attempt_id': res.rows[0].id };
  });
};
exports.startAttempt = startAttempt;

//TODO: change what this sends back based on front-end requirements
/**
 * Update an attempt with number of correct answers
 * @param {number} num_correct - mandatory
 * @param {number} attempt_id - mandatory
 * @returns {object} raw query response object
 */
const finishAttempt = function(num_correct, attempt_id) {
  queryParams = [num_correct, attempt_id];
  queryString = `
    UPDATE attempts
    SET end_time = NOW()::TIMESTAMP,
    num_correct = $1
    WHERE id = $2;
  `;
  return db
    .query(queryString, queryParams)
    .then((res) => {
      return res;
    })
};
exports.finishAttempt = finishAttempt;

//TODO: createQuiz, fetchQuizDetails, fetchQuizQuestions

const addQuiz = function(user_Id, data) {
  const queryParams = [user_Id, data,title, data.description];
  let queryString = `
    INSERT INTO quizzes (owner_id, title, description)
    VALUES ($1, $2, $3);
  `;

//   INSERT INTO questions (quiz_id, prompt) VALUES
// (1, 'Which city is the Capital of China?'),

  return db
    .query(queryString,queryParams)
    .then(res => res)
};
exports.addQuiz = addQuiz;

const fetchQuizDetails = function(quiz_id) {
  const queryParams = [quiz_id];
  const queryString = `
  SELECT * FROM quizzes WHERE id = $1`
  return db
    .query(queryString, queryParams)
    .then(res => {
      if (res.rows) return res.rows[0]
      else return undefined;
    })
};
exports.fetchQuizDetails = fetchQuizDetails;

const fetchQuizQuestions = function(quiz_id) {
  const queryParams = [quiz_id];
  const queryString = `
  SELECT prompt,
    text AS answer,
    is_correct,
    time_limit
    FROM questions
    JOIN answers ON question_id = questions.id
    WHERE quiz_id = $1;
  `;
  return db
    .query(queryString, queryParams)
    .then(res => {
      if (res.rows) return res.rows;
      else return undefined;
    });
};
exports.fetchQuizQuestions = fetchQuizQuestions;

//TODO: remove this before merging
// --- TEST CODE ---


// --- getQuizzes ---

// getQuizzes()
//   .then((data)=>console.log(data)); // expect: an array of 3 objects
// getQuizzes(3)
//  .then((data)=>console.log(data)); // expect: an array of 1 objects


// --- getLeaderBoard ---

// getLeaderBoard(1)
//   .then((data)=>console.log(data)); //expect: an array of 6 objects


// --- startAttempt ---

// startAttempt(1,1)
  // .then(data => console.log(data)); //expect: an attempt_id from the server


// --- finishAttempt ---
  // startAttempt(1,1)
  //   .then((data) => {
  //     finishAttempt(3, data.attempt_id)
  //       .then(data => console.log(data));
  //   })


// --- fetchQuizQuestions ---

// fetchQuizQuestions(4)
  // .then(data => console.log(data)); //expect: undefined
// fetchQuizQuestions(1)
  // .then(data => console.log(data)) //expect: an array with 20 objects
