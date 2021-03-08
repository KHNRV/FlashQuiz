SELECT prompt,
text AS answer
FROM questions
JOIN answers ON question_id = questions.id
WHERE quiz_id = 1 AND is_correct IS TRUE;
