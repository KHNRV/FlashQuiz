DROP TABLE IF EXISTS questions CASCADE;

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  time_limit INTEGER NOT NULL DEFAULT 8000 --default time_limit is 8000 milliseconds
);
