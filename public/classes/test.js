// classes/test.js
// test classes here

const Quiz = require('./quiz')
const Answer = require('./answer')
const Question = require('./question')

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
