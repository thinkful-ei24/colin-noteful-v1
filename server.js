'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

//Load modules
const { PORT } = require('./config')
const express = require('express');
const morgan = require('morgan');

const notesRouter = require('./router/notes.router')

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());


app.use('/api', notesRouter);


//handle errors for invalid requests
app.use(function (req, res, next) {
  console.log('reached after router');
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
