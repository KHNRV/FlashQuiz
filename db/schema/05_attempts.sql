DROP TABLE IF EXISTS attempts CASCADE;

CREATE TABLE attempts (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL DEFAULT NOW()::TIMESTAMP,
  end_time TIMESTAMP, --insert at end of quiz
  num_correct INTEGER --insert at end of quiz
);