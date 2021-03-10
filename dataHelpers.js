const db = require("./db/pool.js");
const Quiz = require("./public/classes/quiz.js");

//? add error handling to all dataHelpers.methods or is that on router?
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
exports.fetchUserNameById = fetchUserNameById;

const fetchAssembledQuiz = function(params) {
  const { questions, quizId, userId, publicId } = params;
  return "fantastic";
};
exports.fetchAssembledQuiz = fetchAssembledQuiz;

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
exports.getUserByEmail = getUserByEmail;

/**
 * Get all public quizzes, or a specific users public and private quizzes
 * @param {number} user_id -  optional
 * @returns {array} array of quiz objects
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
    queryString += `AND owner_id = $1;`;
    queryParams = [user_id];
  } else {
    queryString += `AND is_public = $1;`;
    queryParams = ["TRUE"];
  }
  return db.query(queryString, queryParams).then((res) => {
    const quizArray = [];
    for (row of res.rows) {
      quizArray.push(new Quiz(row.title, row.description, row.is_public));
      quizArray[quizArray.length - 1].setOwnerId(row.creator);
      quizArray[quizArray.length - 1].setQuizId(row.id);
    }
    return quizArray;
  });
};
exports.getQuizzes = getQuizzes;

/**
 * Get the leader board for a specific quiz
 * @param {number} quiz_id - mandatory
 * @returns {array} an array of attempts ordered by score descending
 */
const getLeaderboard = function(quiz_id) {
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
  return db.query(queryString, queryParams).then((res) => res.rows);
};
exports.getLeaderboard = getLeaderboard;

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
  return db.query(queryString, queryParams).then((res) => {
    return res;
  });
};
exports.finishAttempt = finishAttempt;

/**
 * Fetch a quiz by quiz_id
 * @param {number} quiz_id - mandatory
 * @returns {Quiz} returns a Quiz with empty Leaderboard
 */
const fetchQuizDetails = function(quiz_id) {
  const queryParams = [quiz_id];
  const queryString = `
  SELECT * FROM quizzes WHERE id = $1`;
  return db.query(queryString, queryParams).then((res) => {
    if (res.rows) return res.rows[0];
    else return undefined;
  });
};
exports.fetchQuizDetails = fetchQuizDetails;

/**
 * Fetch questions by quiz_id
 * @param {number} quiz_id - mandatory
 * @returns {[Question]} An array of Questions
 */
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
  return db.query(queryString, queryParams).then((res) => {
    if (res.rows) return res.rows;
    else return undefined;
  });
};
exports.fetchQuizQuestions = fetchQuizQuestions;

//TODO: change what this sends back based on front end requirements
/**
 * Adds a Quiz to the database
 * @param {number} user_Id - mandatory
 * @param {Quiz} quiz - mandatory
 * @returns raw query response
 */
const addQuiz = function(user_Id, quiz) {
  const queryParams = [user_Id, quiz.title, quiz.description, quiz.is_public];
  let queryString = `
    INSERT INTO quizzes (owner_id, title, description, is_public)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  return db
    .query(queryString, queryParams)
    .then((res) => res.rows[0].id)
    .then((quiz_id) => {
      queryParams.length = 0;

      queryParams.push(quiz_id);
      queryString = `INSERT INTO questions (quiz_id, prompt) VALUES`;
      const valuesArray = [];

      for (question of quiz.questions) {
        queryParams.push(question.prompt);
        valuesArray.push(` ($1, $${queryParams.length})`);
      }

      queryString += `${valuesArray.join(",")} RETURNING * ;`;

      return db.query(queryString, queryParams);
    })
    .then((res) => {
      queryParams.length = 0;
      queryString =
        "INSERT INTO answers (question_id, text, is_correct) VALUES";
      const valuesArray = [];

      for (let i = 0; i < quiz.questions.length; i++) {
        queryParams.push(res.rows[i].id);
        const qIDParam = `$${queryParams.length}`;
        for (answer of quiz.questions[i].answers) {
          console.log(
            queryParams[queryParams.length - 2],
            queryParams[queryParams.length - 1]
          );
          valuesArray.push(
            ` (${qIDParam},$${queryParams.length - 1}, $${queryParams.length})`
          );
        }
      }
      queryString += `${valuesArray.join(",")} RETURNING *;`;

      return db.query(queryString, queryParams);
    })
    .then((res) => res.rows);
};
exports.addQuiz = addQuiz;

//! this only works with ascii characters for example 'Saīd' would need to be entered as U&'Sa\+012Bd which our db does not support'
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
exports.verifyUserName = verifyUserName;

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
exports.verifyEmail = verifyEmail;

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
exports.addUser = addUser;

// --- addUser ---

// addUser('test', 'test@test.ca', 'testMoney')
//   .then(data => console.log(data))

//TODO: remove this before merging
// --- TEST CODE ---

// --- fetchUsernameById ---

// fetchUserNameById(1).then((data) => console.log(data));

// fetchUserNameById(0).then((data) => console.log(data));

// --- getUserByEmail ---

// getUserByEmail('nick@flashquiz.ca')
//   .then(data => console.log(data))

// --- getQuizzes ---

// getQuizzes()
//   .then((data)=>console.log(data)); // expect: an array of 3 objects
// getQuizzes(3)
//  .then((data)=>console.log(data)); // expect: an array of 1 objects

// --- getLeaderBoard ---

// getLeaderboard(1)
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

// --- fetchQuizDetails ---
// TODO: write tests

// --- fetchQuizQuestions ---

// fetchQuizQuestions(4)
// .then(data => console.log(data)); //expect: undefined
// fetchQuizQuestions(1)
//   .then(data => console.log(data)) //expect: an array with 20 objects

// --- addQuiz ---

// const object = {
//   title: 'Colours',
//   description: 'The category is colours',
//   is_public: 'FALSE',
//   questions: [
//     {
//       prompt: 'What colour is the sky?',
//       answers: [
//         {
//           answer: 'Blue',
//           is_correct: 'TRUE'
//         },
//         {
//           answer: 'Green',
//           is_correct: 'FALSE'
//         },
//         {
//           answer: 'Yellow',
//           is_correct: 'FALSE'
//         },
//         {
//           answer: 'Violet',
//           is_correct: 'FALSE'
//         }
//       ]
//     },
//     {
//       prompt: 'What colour is the sea?',
//       answers: [
//         {
//           answer: 'Wine-dark',
//           is_correct: 'TRUE'
//         },
//         {
//           answer: 'Green',
//           is_correct: 'FALSE'
//         },
//         {
//           answer: 'Blue',
//           is_correct: 'FALSE'
//         },
//         {
//           answer: 'Turquoise',
//           is_correct: 'FALSE'
//         }
//       ]
//     }
//   ]
// }

// addQuiz(1, object)
//   .then(data => console.log(data))

// --- authenticateForms ---

// authenticateForms('test', 'Said')
//   .then(data => console.log(data))

// authenticateForms('kevin@flashquiz.ca', 'MarkBossed')
//   .then(data => console.log(data))

// --- leaderboard object ---
// [
//   {
//     name: 'Saïd',
//     accuracy: '60%',
//     time: PostgresInterval { seconds: 25, milliseconds: 4.935 }, // express as a string
//     computed_score: 1124.6334 // make integer
//   },
//   {
//     name: 'Kevin',
//     accuracy: '60%',
//     time: PostgresInterval { seconds: 26, milliseconds: 4.935 },
//     computed_score: 1049.6334
//   },
//   {
//     name: 'Nick',
//     accuracy: '60%',
//     time: PostgresInterval { seconds: 27, milliseconds: 4.935 },
//     computed_score: 974.6334
//   },
//   {
//     name: 'Saïd',
//     accuracy: '60%',
//     time: PostgresInterval { seconds: 34, milliseconds: 4.935 },
//     computed_score: 449.6334
//   },
//   {
//     name: 'Kevin',
//     accuracy: '60%',
//     time: PostgresInterval { seconds: 35, milliseconds: 4.935 },
//     computed_score: 374.6334
//   },
//   {
//     name: 'Nick',
//     accuracy: '60%',
//     time: PostgresInterval { seconds: 36, milliseconds: 4.935 },
//     computed_score: 299.6334
//   }
// ]
