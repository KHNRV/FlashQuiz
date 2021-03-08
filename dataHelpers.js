const db = require('./db/pool.js');

//TODO: REFACTOR THIS LATER
/**
 * Recreating the function that came with the skeleton
 * @returns {object} the raw query response object
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

//TODO: createQuiz, startAttempt, finishAttempt

const startAttempt = function(quiz_id, user_id) {

  const queryParams = [quiz_id, user_id];
  const queryString = ` INSERT INTO attempts (quiz_id, user_id) VALUES ($1,$2) RETURNING *;`;
  return db
    .query(queryString, queryParams)
    .then ((res) => {
      return { 'attempt_id': res.rows[0].id };
    });
};



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

startAttempt(1,1)
  .then(data => console.log(data)); //expect:
