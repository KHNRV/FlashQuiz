const db = require("../pool");
const { Quiz, Question, Answer } = require("../../public/classes/classes");

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
    description,
    is_public
    FROM quizzes
    JOIN users ON owner_id = users.id
    WHERE is_active IS TRUE
  `;
  if (user_id) {
    queryString += `AND owner_id = $1`;
    queryParams = [user_id];
  } else {
    queryString += `AND is_public = $1`;
    queryParams = ["TRUE"];
  }
  queryString += `ORDER BY id DESC;`;
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

/**
 * Get the leader board for a specific quiz, optionally for a specific user
 * @param {number} quiz_id - mandatory
 * @param {number} user_id - optional
 * @returns {[Quiz]]} an array of attempts ordered by score descending
 */
const fetchLeaderboard = function(quiz_id, user_id) {
  const queryParams = [quiz_id];
  let queryString = `
  SELECT name,
  concat(num_correct * 100 / total_questions, '%') AS accuracy,
  to_char(duration, 'MI:SS') AS time,
  num_correct * (date_part('microsecond', (duration) / max_duration)) AS computed_score
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

  `;
  if (user_id) {
    queryParams.push(user_id);
    queryString += `
      AND users.id = $${queryParams.length}
    `;
  }
  queryString += `
    GROUP BY attempts.id, name, end_time - start_time, num_correct
    ) AS query
    ORDER BY computed_score DESC;
  `;
  return db.query(queryString, queryParams).then((res) => res.rows);
};

//! this could be refactored to be part of getQuizzes
/**
 * Fetch a quiz by quiz_id
 * @param {number} quiz_id - mandatory
 * @returns {Quiz} returns a Quiz object with empty Leaderboard
 */
const fetchQuizDetails = function(quiz_id) {
  const queryParams = [quiz_id];
  const queryString = `
  SELECT quizzes.id AS id,
    users.name AS creator,
    title,
    description,
    is_public
    FROM quizzes
    JOIN users ON owner_id = users.id
    WHERE quizzes.id = $1;`;
  return db.query(queryString, queryParams).then((res) => {
    if (res.rows.length) {
      const quizData = res.rows[0];
      const quiz = new Quiz(
        quizData.title,
        quizData.description,
        quizData.is_public
      );
      quiz.setOwnerId(quizData.creator);
      quiz.setQuizId(quizData.id);
      return quiz;
    } else {
      return undefined;
    }
  });
};

/**
 * Fetch questions by quiz_id
 * @param {number} quiz_id - mandatory
 * @returns {[Question]} An array of Questions
 */
const fetchQuizQuestions = function(quiz_id) {
  const queryParams = [quiz_id];
  const queryString = `
  SELECT prompt,
    text,
    is_correct,
    time_limit
    FROM questions
    JOIN answers ON question_id = questions.id
    WHERE quiz_id = $1;
  `;
  return db.query(queryString, queryParams).then((res) => {
    if (res.rows.length) {
      const questionArray = res.rows.reduce((acc, cur) => {
        if (!acc.length || acc[acc.length - 1].prompt !== cur.prompt) {
          acc.push(new Question(cur.prompt, cur.time_limit));
          acc[acc.length - 1].answers.push(
            new Answer(cur.text, cur.is_correct)
          );
        } else {
          acc[acc.length - 1].answers.push(
            new Answer(cur.text, cur.is_correct)
          );
        }
        return acc;
      }, []);
      return questionArray;
    } else return undefined;
  });
};

/**
 * Adds a Quiz to the database
 * @param {number} user_Id - mandatory
 * @param {Quiz} quiz - mandatory
 * @returns new quiz_id
 */
const addQuiz = function(user_Id, quiz) {
  quiz.setOwnerId(user_Id);
  const queryParams = [
    quiz.getOwnerId(),
    quiz.title,
    quiz.description,
    quiz.isPublic,
  ];
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

      quiz.setQuizId(quiz_id);
      queryParams.push(quiz.getQuizId());
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
        quiz.questions[i].setQuestionId(res.rows[i].id);
        queryParams.push(quiz.questions[i].getQuestionId());
        const qIDParam = `$${queryParams.length}`;
        for (answer of quiz.questions[i].answers) {
          queryParams.push(answer.text);
          queryParams.push(answer.is_correct);
          valuesArray.push(
            ` (${qIDParam},$${queryParams.length - 1}, $${queryParams.length})`
          );
        }
      }
      queryString += `${valuesArray.join(",")} RETURNING *;`;

      return db.query(queryString, queryParams);
    })
    .then((res) => {
      queryParams.length = 0;
      queryParams.push(res.rows[0].question_id);
      queryString = `
        SELECT quizzes.id FROM questions
        JOIN quizzes ON questions.quiz_id = quizzes.id
        WHERE questions.id = $1
        GROUP BY quizzes.id;
      `;
      return db.query(queryString, queryParams);
    })
    .then((res) => res.rows[0].id);
};

module.exports = {
  getQuizzes,
  fetchLeaderboard,
  fetchQuizDetails,
  fetchQuizQuestions,
  addQuiz,
};
