/**
 * This function generate the score board displayed at the end of a quiz
 * @param {string} accuracy
 * @param {string} time
 * @param {integer} points
 * @param {integer} quizId
 * @param {integer} attemptId
 * @returns
 */
const playStatsTemplate = function(accuracy, time, points, quizId, attemptId) {
  return `
  <div class="card shadow border-left-primary py-2 play-question-card">
  <div class="card-body">
  <div class="row align-items-center no-gutters" id="play_stats_disp">
    <div class="col d-flex flex-column mr-2">
      <div class="d-flex flex-column align-items-center" data-aos="zoom-in" data-aos-delay="250">
        <span id="disp_accuracy">${accuracy}</span>
        <span id="tag_accuracy">ACCURACY</span>
      </div>
      <div class="d-flex flex-column align-items-center" data-aos="zoom-in" data-aos-delay="500">
        <span id="disp_time">${time}</span>
        <span id="tag_time">MINUTES</span>
      </div>
      <div class="d-flex flex-column align-items-center" data-aos="zoom-in" data-aos-delay="750">
        <span id="disp_points">${points}</span>
        <span id="tag_points">POINTS</span>
      </div>
    </div>
  </div>
  <div class="row align-items-center no-gutters" id="play_stats_action" >
    <div class="col d-flex flex-column mr-2" >
      <a class="btn btn-primary action_button" role="button" data-clipboard-text="/${quizId}/${attemptId}">SHARE</a>
    </div>
    <div class="col d-flex flex-column mr-2">
      <a class="btn btn-primary action_button" role="button" href="/quizzes/${quizId}/play">TRY
        AGAIN</a>
    </div>
    <div class="col d-flex flex-column mr-2">
      <a class="btn btn-primary action_button" role="button" href="/quizzes/${quizId}">LEAVE</a>
    </div>
  </div>
</div>
`;
};
