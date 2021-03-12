const db = require("../pool");

/**
 * Insert an attempt into the attempts table
 * @param {number} quiz_id - mandatory
 * @param {number} user_id - mandatory
 * @returns {object} attempt_id
 */
const startAttempt = function(quiz_id, user_id) {
  const queryParams = [quiz_id, user_id];
  const queryString = `INSERT INTO attempts (quiz_id, user_id) VALUES ($1,$2) RETURNING *;`;
  return db.query(queryString, queryParams).then((res) => {
    return res.rows[0].id;
  });
};

/**
 * Update an attempt with number of correct answers
 * @param {number} num_correct - mandatory
 * @param {number} attempt_id - mandatory
 * @returns {object} attempt result objet
 */
const finishAttempt = function(num_correct, attempt_id) {
  queryParams = [num_correct, attempt_id];
  queryString = `
    UPDATE attempts
    SET end_time = NOW()::TIMESTAMP,
    num_correct = $1
    WHERE id = $2
    RETURNING *;
  `;
  return db
    .query(queryString, queryParams)
    .then((res) => {
      return res.rows[0].id;
    })
    .then((attempt_id) => {
      const queryParams = [attempt_id];
      let queryString = `
    SELECT name,
    concat(num_correct * 100 / total_questions, '%') AS accuracy,
    to_char(duration, 'MI:SS') AS time,
    floor((((num_correct / total_questions) * 800000) + (num_correct * (1000000 - (date_part('microsecond', (duration) / max_duration)))))*.01) AS computed_score
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
        WHERE attempts.id = $1
        GROUP BY attempts.id, name, end_time - start_time, num_correct
      ) AS query
      ORDER BY computed_score DESC;
    `;
      return db.query(queryString, queryParams);
    })
    .then((res) => res.rows[0]);
};

module.exports = { startAttempt, finishAttempt };
