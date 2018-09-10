


--selects all notes
SELECT * FROM notes;

--selects 5 notes
SELECT * FROM notes
  LIMIT 5;

--selects all notes and orders them in Alphabetical order by name
SELECT * FROM notes ORDER BY name ASC;

--selects all notes and orders them by time created newest-oldest
SELECT * FROM notes ORDER BY date DESC;

SELECT * FROM notes 
