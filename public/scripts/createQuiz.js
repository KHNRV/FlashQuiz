//createQuiz.js
const escapeText = function(str) {
  const element = $("<div>");
  element.text(str);
  return element.html();
};

$(() => {
  $("#new_quiz").on("submit", (event) => {
    event.preventDefault();

    const title = $("[name='title']").val();
    const description = $("[name='description']").val();
    const isPublic = $("[type='checkbox']").prop("checked");

    const quiz = new Quiz(title, description, isPublic);

    const prompts = $("[name='prompt']");
    const correctAnswers = $("[name='correct']");
    const wrongAnswers1 = $("[name='wrong_1']");
    const wrongAnswers2 = $("[name='wrong_2']");
    const wrongAnswers3 = $("[name='wrong_3']");

    // console.log(Object.keys(prompts));
    // console.log(prompts);
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
      $("#new_quiz").off();
      $("#new_quiz").trigger("reset");
      $("#new_quiz").trigger("submit");
    });
  });

  //add a question card and initialize couter on load
  let counter = 1;
  $("#questions_container").append(questionCardTemplate(counter));

  //add more questions
  $("#add_question").click(() => {
    counter += 1;
    $("#questions_container").append(questionCardTemplate(counter));
  });

  //delete a question
  $("#questions_container").on("click", ".delete_question", function(event) {
    $(event.target).parents(".create_card").remove();
  });
});
