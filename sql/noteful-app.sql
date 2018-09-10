SELECT CURRENT_DATE;


DROP TABLE IF EXISTS notes;

CREATE TABLE notes(
  id serial PRIMARY KEY,
  title text,
  content text,
  date timestamp DEFAULT current_timestamp
);

