/**
 * Generate a question card element for the play module
 * @param {string} prompt - A question to ask
 * @param {array} answers - An array of four answer objects
 * @returns {string}  Question card element
 */
const playTemplate = function(prompt, answers, progression) {
  return `
  <div class="card shadow border-left-primary py-2 play-question-card">
  <div class="card-body" data-aos="zoom-out">
      <div class="row align-items-center no-gutters q_name_div">
          <div class="col mr-2">
              <h3>
                  <strong>${prompt}</strong>
              </h3>
          </div>
      </div>
      <div class="row align-items-center no-gutters">
          <div class="col d-flex flex-column mr-2">
              <button class="btn btn-primary answer
              ${
  answers[0].is_correct ? " is_correct" : "is_wrong"
}" type="button">
                  <span class="answer_tag">A.</span>
                  <span class="d-inline-flex flex-wrap answer_text"><strong>${
  answers[0].text
}</strong></span>
              </button>
              <button class="btn btn-primary answer
              ${
  answers[1].is_correct ? " is_correct" : "is_wrong"
}" type="button">
                  <span class="answer_tag">B.</span>
                  <span class="d-inline-flex flex-wrap answer_text"><strong>${
  answers[1].text
}</strong></span>
              </button>
              <button class="btn btn-primary answer
              ${
  answers[2].is_correct ? " is_correct" : "is_wrong"
}" type="button">
                  <span class="answer_tag">C.</span>
                  <span class="d-inline-flex flex-wrap answer_text"><strong>${
  answers[2].text
}</strong></span>
              </button>
              <button class="btn btn-primary answer
              ${
  answers[3].is_correct ? " is_correct" : "is_wrong"
}" type="button">
                  <span class="answer_tag">D.</span>
                  <span class="d-inline-flex flex-wrap answer_text"><strong>${
  answers[3].text
}</strong></span>
              </button>
          </div>
      </div>
  </div>
  <div class="progress">
      <div class="progress-bar progress-bar-animated" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"
          style="width: ${progression}%;"><span class="sr-only">50%</span></div>
  </div>
</div>
`;
};
