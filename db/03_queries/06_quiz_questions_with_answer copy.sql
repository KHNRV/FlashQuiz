SELECT prompt,
text AS answer,
is_correct,
time_limit
FROM questions
JOIN answers ON question_id = questions.id
WHERE quiz_id = 1;
