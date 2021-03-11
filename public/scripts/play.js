const quiz = {
  title: "The Super Fast Quiz",
  description: "It is super fast. Don't blink!",
  isPublic: true,
  questions: [
    {
      prompt: "From 1964 to 1985, who asked you not to squeeze the Charmin?",
      answers: [
        { text: "Mrs. Potts", is_correct: false },
        { text: "Mr. Whipple", is_correct: true },
        { text: "Mr. Rogers", is_correct: false },
        { text: "Mrs. Fields", is_correct: false },
      ],
    },
    {
      prompt:
        "Nadia Comaneci was the first gymnast to ever do what at the Olympics?",
      answers: [
        { text: "Get a perfect 10", is_correct: true },
        { text: "Finish with a broken ankle", is_correct: false },
        { text: "Win an Olympic gold medal", is_correct: false },
        { text: "Forfeit her position", is_correct: false },
      ],
    },
    {
      prompt:
        "Which of these birds has the biggest brain relative to its size?",
      answers: [
        { text: "Ostrich", is_correct: false },
        { text: "Hummingbird", is_correct: true },
        { text: "Sparrow", is_correct: false },
        { text: "Eagle", is_correct: false },
      ],
    },
    {
      prompt:
        "When playing Blackjack, how many points would be considered a bust?",
      answers: [
        { text: "21", is_correct: false },
        { text: "22", is_correct: true },
        { text: "15", is_correct: false },
        { text: "19", is_correct: false },
      ],
    },
  ],
};

// Request and receive the quiz object

// Create an array with all the html quiz cards ready
$(document).ready(function() {
  const questionStack = [];

  quiz.questions.forEach((question, index) => {
    const progression = Math.round((index / quiz.questions.length) * 100);
    questionStack.push(
      playTemplate(question.prompt, question.answers, progression)
    );
  });

  console.log(questionStack);
  $("#play_box").append(questionStack[3]);
});

// $(document).ready(function() {
//   $("#play_box").append(
//     playTemplate(
//       "From 1964 to 1985, who asked you not to squeeze the Charmin?",
//       [
//         { text: "Mrs. Potts", is_correct: false },
//         { text: "Mr. Whipple", is_correct: true },
//         { text: "Mr. Rogers", is_correct: false },
//         { text: "Mrs. Fields", is_correct: false },
//       ]
//     )
//   );
// });
