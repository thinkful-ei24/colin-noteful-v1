'use strict';

// Load array of notes
const data = require('./db/notes');
//Load modules
const { PORT } = require('./config')
const express = require('express');
const {getLogs} = require('./middleware/logger');
const app = express();

app.use(express.static('public'));

app.use(getLogs);

//handle search term 
app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if (searchTerm) {
    return res.json(data.filter(item => item.title.includes(searchTerm)));
  };
  res.json(data);
});

//handle returning a specific item with a given ID
app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  res.json(data.find(item => item.id === Number(id)));
});


//handle errors for invalid requests
app.use(function (req, res, next) {
  console.log('is working');
  var err = new Error('NotFound');
  err.status = 404;
  res.status(404).json({ message: 'Not found' });
  //next(err); ***this line of code is prefereable to the line above ->
  //it will catch all errors that occur
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
  message: err.message,
  error: err
  });
});
//end handling errors

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


// INSERT EXPRESS APP CODE HERE...
