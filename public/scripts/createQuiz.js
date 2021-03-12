/**
 * HTML escapes a given string and return the safe version
 * @param {string} str
 * @returns
 */
const escapeText = function(str) {
  const element = $("<div>");
  element.text(str);
  return element.html();
};

/**
 * Send a new quiz to the database from the content of a form
 * @param {object} event
 */
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
  quiz.addQuizDetails(escapeText(title), escapeText(description), !isPublic);

  //iterate over jQuery "arrays" and create associated classes as they are added to the quiz
  for (let i = 0; i < prompts.length; i++) {
    const question = new Question(escapeText($(prompts[i]).val()));
    question.addAnswer(
      new Answer(escapeText($(correctAnswers[i]).val()), true)
    );
    question.addAnswer(
      new Answer(escapeText($(wrongAnswers1[i]).val()), false)
    );
    question.addAnswer(
      new Answer(escapeText($(wrongAnswers2[i]).val()), false)
    );
    question.addAnswer(
      new Answer(escapeText($(wrongAnswers3[i]).val()), false)
    );
    quiz.addQuestion(question);
  }

  $.ajax({
    url: "/quizzes",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(quiz),
  }).done((response) => {
    const quizId = response.quizId;
    window.location.href = `/quizzes/${quizId}`;
    $("#new_quiz").trigger("reset");
  });
};

/**
 * Append a new question card to the form
 * @param {integer} counter
 */
const addQuestionCard = function(counter) {
  $("#questions_container").append(questionCardTemplate(counter));
};

let counter = 1;

$(() => {
  $("form").submit((event) => {
    submitQuiz(event);
  });

  //add a question card and initialize counter on load
  addQuestionCard(counter);

  //add question card
  $("#add_question").click(() => {
    counter += 1;
    addQuestionCard(counter);
  });

  //delete a question card from the container
  $("#questions_container").on("click", ".delete_question", function(event) {
    $(event.target).parents(".create_card").remove();
  });
});
