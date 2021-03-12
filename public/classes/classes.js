/**
 * The quiz object is used to exchange quiz data in a standard form between the
 * front-end and the back-end
 */
class Quiz {
  constructor() {
    this.questions = [];
    this.globalLeaderboard = [];
    this.personalLeaderboard = [];
    this.specifiedLeaderboard = [];
  }

  /**
   * Populate this quiz with an object
   * @param {object} JSONObject
   */
  initializeFromJSON(JSONObject) {
    this.addQuizDetails(
      JSONObject.title,
      JSONObject.description,
      JSONObject.isPublic
    );

    for (const question of JSONObject.questions) {
      const newQuestion = new Question(question.prompt);
      for (const answer of question.answers) {
        newQuestion.addAnswer(new Answer(answer.text, answer.is_correct));
      }
      this.addQuestion(newQuestion);
    }

    this.addLeaderboard(JSONObject.globalLeaderboard, "globalLeaderboard");

    this.addLeaderboard(JSONObject.personalLeaderboard, "personalLeaderboard");

    this.addLeaderboard(
      JSONObject.specifiedLeaderboard,
      "specifiedLeaderboard"
    );
  }

  /**
   * Add quiz details to this quiz
   * @param {string} title
   * @param {string} description
   * @param {boolean} isPublic
   */
  addQuizDetails(title, description, isPublic) {
    this.title = title;
    this.description = description;
    this.isPublic = isPublic;
  }

  /**
   * Add a question to this quiz
   * @param {object} - Question object
   */
  addQuestion(question) {
    this.questions.push(question);
  }

  /**
   * Return a shuffled copy of the questions array
   * @returns {array}
   */
  randomizeQuestions() {
    return this.questions.sort(() => {
      return Math.random() - 0.5;
    });
  }

  /**
   * Add a leaderboard to this quiz
   * @param {array} leaderboard
   * @param {string} leaderboardType -
   *  - specifiedLeaderboard : The result of a specific attempt
   *  - personalLeaderboard : The results of a specific user
   *  - globalLeaderboard : Every users results
   */
  addLeaderboard(leaderboard, leaderboardType) {
    leaderboard.forEach((v) => this[leaderboardType].push(v));
  }

  /**
   * Return the id of this quiz
   * @returns  id of this quiz
   */
  getQuizId() {
    return this._quizId;
  }
  /**
   * Return the id of the creator of this quiz
   * @returns  id of the creator of this quiz
   */
  getOwnerId() {
    return this._ownerId;
  }

  /**
   * Set the owner id of this quiz to the given value
   * @param {string} userId
   */
  setOwnerId(userId) {
    // Add some sort of validation to this
    //? Do we link this method to a db query
    this._ownerId = userId;
  }

  setQuizId(quizId) {
    // Add some sort of validation to this
    //? Do we link this method to a db query?
    this._quizId = quizId;
  }
}

class Question {
  constructor(prompt, time_limit) {
    this.prompt = prompt;
    // Initialize a list of answers
    this.answers = [];
    if (time_limit === undefined) {
      this.time_limit = null;
    } else {
      this.time_limit = time_limit;
    }
  }

  addAnswer(answer) {
    this.answers.push(answer);
  }

  randomizeAnswers() {
    return this.answers.sort(() => {
      return Math.random() - 0.5;
    });
  }

  getQuestionId() {
    return this._questionId;
  }

  setQuestionId(questionId) {
    this._questionId = questionId;
  }
}

class Answer {
  constructor(text, is_correct) {
    this.text = text;
    this.is_correct = is_correct;
  }
}

try {
  module.exports = { Quiz, Question, Answer };
} catch (err) {
  console.log("Hello client!");
}
