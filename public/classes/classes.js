// classes.js

class Quiz {
  constructor() {
    // Initialize a list of questions
    this.questions = [];
    // Initialize leaderboard arrays
    this.globalLeaderboard = [];
    this.personalLeaderboard = [];
    this.specifiedLeaderboard = [];
  }

  initializeFromJSON(JSONObject) {
    this.addQuizDetails(JSONObject.title, JSONObject.description, JSONObject.isPublic);

    for (const question of JSONObject.questions) {
      const newQuestion = new Question(question.prompt)
      for (const answer of question.answers) {
        newQuestion.addAnswer(new Answer(answer.text, answer.is_correct));
      }
      this.addQuestion(newQuestion);
    }

    this.addLeaderboard(JSONObject.globalLeaderboard, "globalLeaderboard");

    this.addLeaderboard(JSONObject.personalLeaderboard, "personalLeaderboard");

    this.addLeaderboard(JSONObject.specifiedLeaderboard, "specifiedLeaderboard");

  }

  addQuizDetails(title, description, isPublic) {
    this.title = title;
    this.description = description;
    this.isPublic = isPublic;
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  randomizeQuestions() {
    return this.questions.sort(() => {
      return Math.random() - 0.5;
    });
  }

  addLeaderboard(leaderboard, leaderboardType) {
    leaderboard.forEach((v) => this[leaderboardType].push(v));
  }

  getQuizId() {
    return this._quizId;
  }

  getOwnerId() {
    return this._ownerId;
  }

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
