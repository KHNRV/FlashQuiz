//createQuiz.js
const escapeText = function(str) {
  const element = $('<div>');
  element.text(str);
  return element.html();
};


$(() => {
  $("body").on("click", "#new_quiz", (event) => {
    event.preventDefault();
    const title = $("[name='title']").val();
    const description = $("[name='description']").val()
    const isPublic = $("[type='checkbox']").prop("checked")

    console.log(title, description, isPublic);
    const prompts = $("[name='prompt']");
    for (const prompt of $("[name='prompt']")) {
      console.log($(prompt).val());
    }
    for (const correct_answer of $("[name='answer']")) {
      console.log($(prompt).val());
    }

    // $.ajax({
    //   url: "/quizzes",
    //   method: "POST",
    //   contentType: "application/json",
    //   data: JSON.stringify(quiz),
    // }).done(() => {
    //   $("#new_quiz").trigger("reset");
    // });
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
