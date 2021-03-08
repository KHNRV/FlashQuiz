-- TODO: bring this leaderboard style before the group

SELECT name,
concat(num_correct * 100 / total_questions, '%') AS accuracy,
duration AS time,
num_correct * (0.8 + (1000000 - (date_part('microsecond', (duration) / max_duration))))/1000 AS computed_score
FROM (
  SELECT
  attempts.id,
  name,
  end_time - start_time AS duration,
  SUM(questions.time_limit / 1000) max_duration,
  num_correct,
  COUNT(questions.*) AS total_questions
  FROM attempts
  JOIN quizzes ON attempts.quiz_id = quizzes.id
  JOIN questions ON questions.quiz_id = quizzes.id
  JOIN users ON attempts.user_id = users.id
  WHERE end_time IS NOT NULL AND quizzes.id = 1
  GROUP BY attempts.id, name, end_time - start_time, num_correct
) AS query
ORDER BY computed_score DESC;
