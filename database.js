const db = require('./db/index.js');

//TODO: DELETE THIS LATER
/**
 * Recreating the function that came with the skeleton
 * @returns the raw pg query response object
 */
const users = function() {
  return db.query('SELECT * FROM users;')
};
exports.users = users;
/**
 * Get all public quizzes, or a users public and private quizzes
 * @param {number} user_id -  optional
 * @returns
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
exports.users = users;

//TODO: remove this before merging
// --- TEST CODE ---

// --- getQuizzes ---

getQuizzes()
  .then((data)=>console.log(data)); // expect: an array of 3 objects

getQuizzes(3)
  .then((data)=>console.log(data)) // expect: an array of 1 objects


