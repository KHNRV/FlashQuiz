-- quizzes table seeds here

INSERT INTO quizzes (owner_id, title, description)
VALUES (1, 'Capitals of the World', 'Test your knowledge of world Geography');
INSERT INTO quizzes (owner_id, title, description)
VALUES (2, 'Basic Math', 'Test your knowledge of basic math');
INSERT INTO quizzes (owner_id, title, description)
VALUES (3, 'Animal Triva', 'Test your knowledge of animals');
INSERT INTO quizzes (owner_id, title, description, is_public)
VALUES (3, 'Private Quiz', 'A quiz without any questions', false);
INSERT INTO quizzes (owner_id, title, description, is_public)
VALUES (2, 'The Super Fast Quiz', 'It is super fast. Do not blink!', true)
