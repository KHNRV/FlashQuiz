/**
 * Shuffle the given array
 * @param {array} arr
 * @source javascript.info
 */
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};
/**
 * Keeps track of the number of correct answers
 */
let num_correct = 0;
$(document).ready(function() {
  /**
   * Array containing all the HTML question card elements to load into the
   * window
   */
  const questionStack = [];

  let attemptId;
  $.ajax({
    url: `/quizzes/${quizId}/json`,
    method: "GET",
    contentType: "application/json",
    success: (response) => {
      quiz = response;

      shuffle(quiz.questions);
      quiz.questions.forEach((question, index) => {
        const progression = Math.round((index / quiz.questions.length) * 100);
        shuffle(question.answers);
        questionStack.push(
          playTemplate(question.prompt, question.answers, progression)
        );
      });
    },
    error: (error) => {
      console.log(error);
    },
  })
    .done(() => {
      /**
       * Get the quiz data to load in the game engine
       */
      $.ajax({
        url: `/quizzes/${quizId}/play/start`,
        method: "GET",
        contentType: "application/json",
        success: (response) => {
          attemptId = response.attemptId;
        },
        error: (error) => {
          console.log(error);
        },
      });
    })
    .done(() => {
      $("#play_box").append(questionStack.shift());
    });

  $("#play_box").on("click", ".answer", function() {
    //disable focusing other answers
    $(this).siblings().attr("disabled", true);
    $(window).mousedown(false);

    if ($(this).hasClass("is_correct")) {
      // compute the result
      num_correct += 1;
      $(this).click(false);
    }
    // remove the play card
    setTimeout(() => {
      $(this).parents(".card-body").removeClass("aos-animate");
      setTimeout(() => {
        $("#play_box").empty();
        if (questionStack[0]) {
          $("#play_box").append(questionStack.shift());
          $(window).off("mousedown");
        } else {
          const userScore = { score: num_correct, attemptId };
          /**
           * Send the result to the database
           */
          $.ajax({
            url: `/quizzes/${quizId}/play/end`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(userScore),
          }).then((response) => {
            console.log(response);
            const attemptId = response.attemptId;
            const { name, accuracy, time, computed_score } = response.score;
            const userName = response.userName;
            //ICI
            $("#play_box").append(
              playStatsTemplate(
                accuracy,
                time,
                computed_score,
                quiz._quizId,
                attemptId
              )
            );
            new ClipboardJS(".btn");
          });
        }
      }, 250);
    }, 250);
  });
});
