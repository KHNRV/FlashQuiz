const db = require("../pool")

/**
 * Check to see if an email already exists in the database
 * @param {string} email
 * @returns {boolean} returns true if email already exists in database
 */
 const verifyEmail = function(email) {
  const queryParams = [getUserByEmail];
  const queryString = `
  SELECT * FROM users
  WHERE email = $1;
  `;

  return db.query(queryString, queryParams).then((res) => {
    if (res.rows.length) return false;
    else return true;
  });
};

/**
 * Check to see if a username already exists in the database
 * @param {string} username - mandatory
 * @returns {boolean} returns true if username already exists in database
 */
 const verifyUserName = function(username) {
  const queryParams = [username];
  const queryString = `
  SELECT * FROM users
  WHERE name = $1;
  `;

  return db.query(queryString, queryParams).then((res) => {
    if (res.rows.length) return false;
    else return true;
  });
};

/**
 * Get the user object associated with a specific email
 * @param {string} email - mandatory
 * @returns {object} user object associated with email
 */
 const getUserByEmail = function(email) {
  const queryParams = [email];
  const queryString = `
    SELECT * FROM users WHERE email = $1;
  `;
  return db.query(queryString, queryParams).then((res) => res.rows[0]);
};

/**
 * Get the user's username from a specific user id
 * @param {number} user_id - mandatory
 * @returns {string} users.name associated with user_id
 */
 const fetchUserNameById = function(user_id) {
  const queryParams = [user_id];
  if (user_id === undefined) user_id = 0;
  return db
    .query("SELECT * FROM users WHERE id = $1;", queryParams)
    .then((res) => {
      if (res.rows.length) return res.rows[0].name;
      else return undefined;
    });
};

/**
 * Insert a new user into the database
 * @param {object} newUser - object with username, email, password keys
 * @returns the new user id.
 */
 const addUser = function(newUser) {
  const { username, email, password } = newUser;
  queryParams = [username, email, password];
  queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  return db.query(queryString, queryParams).then((res) => res.rows[0].id);
};

module.exports = { fetchUserNameById, getUserByEmail, verifyUserName, verifyEmail, addUser }
