--get all quiz results for a specific quiz and a specific user
SELECT name,
end_time - start_time AS attempt_duration,
SUM(questions.time_limit) / 1000 AS max_duration,
num_correct AS correct_answers,
COUNT(questions.*) AS total_questions
FROM attempts
JOIN quizzes ON attempts.quiz_id = quizzes.id
JOIN questions ON questions.quiz_id = quizzes.id
JOIN users ON attempts.user_id = users.id
WHERE end_time IS NOT NULL AND quizzes.id = 1 AND users.id = 1
GROUP BY attempts.id, name, end_time - start_time, num_correct
ORDER BY attempt_duration;
