// classes.js

class Quiz {
  constructor(title, description, isPublic) {
    this.title = title;
    this.description = description;
    this.isPublic = isPublic;
    // Initialize a list of questions
    this.questions = [];
    // Initialize leaderboard arrays
    this.globalLeaderboard = [];
    this.personalLeaderboard = [];
    this.specifiedLeaderboard = [];
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  randomizeQuestions() {
    return this.questions.sort(() => {
      //Returns a random integer between -1 and 1
      return Math.floor(Math.random() * 3 - 1);
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
    return this.Answers.sort(() => {
      //Returns a random integer between -1 and 1
      return Math.floor(Math.random() * 3 - 1);
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
