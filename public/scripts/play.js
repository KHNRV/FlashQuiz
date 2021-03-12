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
// Create an array with all the html quiz cards ready
let num_correct = 0;
$(document).ready(function() {
  const questionStack = [];
  //ajax request for the quiz questions | ASYNC

  ///quizzes
  //quizzes/:quizId --> welcome page for a specific page
  //quizzes/:quizId/play --> Play engine along with the quiz object

  // let quiz;
  let attemptId;
  $.ajax({
    url: `/quizzes/${quizId}/json`, ///quizzes/quizId/play
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

  //ajax request to log the attempt start get the attempt id back | ASYNC
  //handle the event of an answer being clicked
  $("#play_box").on("click", ".answer", function() {
    // some kind of animation with a promise

    //disable focusing other answers
    $(this).siblings().attr("disabled", true);
    $(window).mousedown(false);

    if ($(this).hasClass("is_correct")) {
      // compute the result
      num_correct += 1;
      console.log(num_correct);
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
    }, 750);
  });

  //
  // Compute final score

  //ajax request to log the attempt end send id and final score

  //redirect to quizzes/:quizId/:userName
});
