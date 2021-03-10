//this code tests the addQuiz function - meant to illustrate how questions are construcuted
const db = require("./index")
const { Quiz, Question, Answer } = require('../../public/classes/classes')

const quiz = new Quiz('Colours', 'Existential questions about colours', false)
const questions = [new Question('What colour is the sky?'), new Question('What colour is the sea?')]
const answers1 = [
  new Answer('Blue', true),
  new Answer('Gray', false),
  new Answer('Orange', false),
  new Answer('Yellow', false)
]
const answers2 = [
  new Answer('Wine-dark', true),
  new Answer('Blue', false),
  new Answer('Green', false),
  new Answer('Turquoise', false)
]

for (answer of answers1) {
  questions[0].addAnswer(answer)
}
for (answer of answers2) {
  questions[1].addAnswer(answer)
}
for (question of questions) {
  quiz.addQuestion(question)
}

db.addQuiz(3,quiz).then(data=>console.log(data))
