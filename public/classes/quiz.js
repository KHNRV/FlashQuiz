//classes/quiz.js

class Quiz {

  constructor(title, description, isPublic) {
    this.title = title;
    this.description = description;
    this.isPublic = isPublic;
    // Initialize a list of questions
    this.questions = [];
    // Initialize leaderboard
    this.leaderboard = [];
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  randomizeQuestions() {
    return this.questions.sort(()=>{
      //Returns a random integer between -1 and 1
      return Math.floor((Math.random()*3) -1)
    })
  }

  addLeaderboard(leaderboard) {
    leaderboard.push(entry);
  }

  getQuizId() {
    return this._quizId;
  }

  getOwnerId() {
    return this._ownerId;
  }

  //! These methods could be from a sub-class that extends Quiz - this way they can live in a different section of the app and not cause problems for us on the client side
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

}

class Answer {

  constructor(answer,is_correct) {
    this.answer = answer;
    this.is_correct = is_correct;
  }

}


const quiz = new Quiz('Colours', 'Existential questions about colours', false)
const question1 = new Question('What colour is the sky?')
const question2 = new Question('What colour is the sea?')
const answer1 = new Answer('Blue', true)
const answer2 = new Answer('Gray', false)
const answer3 = new Answer('Orange', false)
const answer4 = new Answer('Yellow', false)
const answer5 = new Answer('Wine-dark', true)
const answer6 = new Answer('Blue', false)
const answer7 = new Answer('Green', false)
const answer8 = new Answer('Turquoise', false)
question1.addAnswer(answer1)
console.log(question1)
question2.addAnswer(new Answer('Flag',true))
console.log(question2)
quiz.addQuestion(new Question('What is my name').addAnswer('Nick', true))
console.log(quiz)


    const object = {
      title: 'Colours',
      description: 'The category is colours',
      is_public: 'FALSE',
      questions: [
        {
          prompt: 'What colour is the sky?',
          answers: [
            {
              answer: 'Blue',
              is_correct: 'TRUE'
            },
            {
              answer: 'Green',
              is_correct: 'FALSE'
            },
            {
              answer: 'Yellow',
              is_correct: 'FALSE'
            },
            {
              answer: 'Violet',
              is_correct: 'FALSE'
            }
          ]
        },
        {
          prompt: 'What colour is the sea?',
          answers: [
            {
              answer: 'Wine-dark',
              is_correct: 'TRUE'
            },
            {
              answer: 'Green',
              is_correct: 'FALSE'
            },
            {
              answer: 'Blue',
              is_correct: 'FALSE'
            },
            {
              answer: 'Turquoise',
              is_correct: 'FALSE'
            }
          ]
        }
      ]
    }
