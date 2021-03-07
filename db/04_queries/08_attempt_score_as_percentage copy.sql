--get a specific quiz result for a specific quiz and a specific user display attempt_id and score as a percentage
SELECT attempts.id,
name,
concat(num_correct * 100 / COUNT(questions.*), '%') AS accuracy
FROM attempts
JOIN quizzes ON attempts.quiz_id = quizzes.id
JOIN questions ON questions.quiz_id = quizzes.id
JOIN users ON attempts.user_id = users.id
WHERE end_time IS NOT NULL AND quizzes.id = 1 AND attempts.id = 1
GROUP BY attempts.id, name, end_time - start_time, num_correct;
