/**
 * This function generates the HTML code of the question card for the quiz
 * creator
 * @param {integer} counter - Number of the question. Should be incremented
 * after every use.
 * @returns HTML of question card
 */
const questionCardTemplate = function(counter) {
  return $(`
  <div class="card shadow border-left-primary py-2 create_card" data-aos="flip-up" data-aos-delay="250"
  data-aos-once="true">
  <div class="card-body">
    <div class="d-flex justify-content-between">
      <span class="card_type">QUESTION ${counter}</span>
      <a class="delete_question">
        <i class="fa fa-minus-circle d-flex align-self-end"></i>
      </a>
    </div>
    <div class="form-group">
      <label class="input_type">QUESTION</label>
      <input class="border rounded-pill border-primary form-control visible" type="text" name="prompt"
        placeholder="Ask your question..." required="" maxlength="255">
    </div>
    <div class="form-group">
      <label class="input_type">CORRECT ANSWER</label>
      <input class="border rounded-pill border-primary form-control visible" type="text" name="correct"
        placeholder="Write the correct answer..." required="" maxlength="255">
    </div>
    <div class="form-group">
      <label class="input_type">WRONG ANSWER (1/3)</label>
      <input class="border rounded-pill border-primary form-control visible" type="text" name="wrong_1"
        placeholder="Write a lie..." required="" maxlength="255">
    </div>
    <div class="form-group">
      <label class="input_type">WRONG ANSWER (2/3)</label>
      <input class="border rounded-pill border-primary form-control visible" type="text" name="wrong_2"
        placeholder="Write a lie..." required="" maxlength="255">
    </div>
    <div class="form-group">
      <label class="input_type">WRONG ANSWER (3/3)</label>
      <input class="border rounded-pill border-primary form-control visible" type="text" name="wrong_3"
        placeholder="Write a lie..." required="" maxlength="255">
    </div>
  </div>
</div>
`);
};
