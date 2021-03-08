--! I do not recommend returning this exact table - I want to illustrate an option for how to compute a score with a query
--TODO: still need to determine how scores would work
--in this example I basically create a score modifier that adds ratio of time remaining  to a minimum possible modifier of .80
-- ex. if you took up ALL the time, your score would be 80% of the correct questions,
-- if you managed to answer every question instantaneously your score would be 180% of of the correct questions
-- ? if we wanted to we could make the scores a very large number just to make it seem more exciting

SELECT id,
name,
num_correct,
(0.8 + (1000000 - (date_part('microsecond', (duration) / max_duration)))/ 1000000) AS score_modifier,
num_correct * (0.8 + (1000000 - (date_part('microsecond', (duration) / max_duration)))/ 1000000) AS computed_score
FROM (
  SELECT
  attempts.id,
  name,
  end_time - start_time AS duration,
  SUM(questions.time_limit / 1000) max_duration,
  num_correct
  FROM attempts
  JOIN quizzes ON attempts.quiz_id = quizzes.id
  JOIN questions ON questions.quiz_id = quizzes.id
  JOIN users ON attempts.user_id = users.id
  WHERE end_time IS NOT NULL AND quizzes.id = 1 AND attempts.id = 1
  GROUP BY attempts.id, name, end_time - start_time, num_correct
) AS query;
