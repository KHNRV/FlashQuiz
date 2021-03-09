// classes/question.js
class Question {

  constructor(prompt) {
    this.prompt = prompt;
    // Initialize a list of answers
    this.answers = [];
  }

  addAnswer(answer) {
    this.answers.push(answer);
  }

  randomizeAnswers() {
    return this.Answers.sort(()=>{
      //Returns a random integer between -1 and 1
      return Math.floor((Math.random()*3) -1)
    })
  }

  getQuestionId() {
    return this._questionId;
  }

  setQuestionId(questionId) {
    this._questionId = questionId;
  }

}

module.exports = Question;
