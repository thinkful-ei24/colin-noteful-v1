'use strict';

// Load array of notes
const data = require('./db/notes');

const { PORT } = require('./config')

const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if (searchTerm) {
    return res.json(data.filter(item => item.title.includes(searchTerm)));
  };
  res.json(data);
});

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  res.json(data.find(item => item.id === Number(id)));
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


// INSERT EXPRESS APP CODE HERE...
