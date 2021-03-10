//createQuiz.js

$(() => {
  $("#new_quiz").on("submit", (event) => {
    const quiz = new Quiz("title", "description", false);
    event.preventDefault();
    const prompts = $("[name='prompt']");
    prompts.forEach((prompt) => console.log(prompt.val()));
    console.log(prompts);
    // $.ajax({
    //   url: "/quizzes",
    //   method: "POST",
    //   contentType: "application/json",
    //   data: JSON.stringify(quiz),
    // }).done(() => {
    //   $("#new_quiz").trigger("reset");
    // });
  });

  //plus on load
  let counter = 1;
  $("#questions_container").append(questionCardTemplate(counter));
  //plus
  $("#add_question").click(() => {
    counter += 1;
    $("#questions_container").append(questionCardTemplate(counter));
  });
  //minus
  // $(".delete_question").click((event) => {
  //   console.log($(event.target).parents(".create_card"));
  //   $(event.target).parents(".create_card").remove();
  // });

  $("#questions_container").on("click", ".delete_question", function(event) {
    $(event.target).parents(".create_card").remove();
  });
  console.log(quiz);
});
