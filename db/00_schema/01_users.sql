DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL
);