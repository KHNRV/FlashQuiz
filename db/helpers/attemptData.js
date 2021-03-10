const db = require("../pool")

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
    return { attempt_id: res.rows[0].id };
  });
};


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
  return db.query(queryString, queryParams).then((res) => {
    return res;
  });
};

module.exports = { startAttempt, finishAttempt}
