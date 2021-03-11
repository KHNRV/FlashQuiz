//createQuiz.js
const escapeText = function(str) {
  const element = $("<div>");
  element.text(str);
  return element.html();
};

const submitQuiz = function(event) {
  event.preventDefault();

  // store quiz information
  const title = $("[name='title']").val();
  const description = $("[name='description']").val();
  const isPublic = $("[type='checkbox']").prop("checked");
  const prompts = $("[name='prompt']");
  const correctAnswers = $("[name='correct']");
  const wrongAnswers1 = $("[name='wrong_1']");
  const wrongAnswers2 = $("[name='wrong_2']");
  const wrongAnswers3 = $("[name='wrong_3']");

  const quiz = new Quiz();
  quiz.addQuizDetails(title, description, !isPublic);

  //iterate over jQuery "arrays" and create associated classes as they are added to the quiz
  for (let i = 0; i < prompts.length; i++) {
    const question = new Question($(prompts[i]).val());
    question.addAnswer(new Answer($(correctAnswers[i]).val(), true));
    question.addAnswer(new Answer($(wrongAnswers1[i]).val(), false));
    question.addAnswer(new Answer($(wrongAnswers2[i]).val(), false));
    question.addAnswer(new Answer($(wrongAnswers3[i]).val(), false));
    quiz.addQuestion(question);
  }

  $.ajax({
    url: "/quizzes",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(quiz),
  }).done(() => {
    // turn off event handlers for #new_quiz, trigger a form reset, then trigger submit (default form behaviour makes a GET request to /quizzes)
    $("#new_quiz").off();
    $("#new_quiz").trigger("reset");
    $("#new_quiz").trigger("submit");
  });
};

const addQuestionCard = function(counter) {
  counter += 1;
  $("#questions_container").append(questionCardTemplate(counter));
};

let counter = 0;

$(() => {
  $("#new_quiz").on("submit", (event) => {
    submitQuiz(event);
  });

  //add a question card and initialize counter on load
  addQuestionCard(counter);

  //add question card
  $("#add_question").click(() => {
    addQuestionCard(counter);
  });

  //delete a question card from the container
  $("#questions_container").on("click", ".delete_question", function(event) {
    $(event.target).parents(".create_card").remove();
  });
});
