'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

//Load modules
const { PORT } = require('./config')
const express = require('express');
const {getLogs} = require('./middleware/logger');
const app = express();

app.use(getLogs);

app.use(express.static('public'));
app.use(express.json());

//looks at an endpoint (/api/notes/...) with a specific ID number with the purpose of updating
app.put('/api/notes/:id', (req, res, next) => {
  //sets 'id' to the endpoint id 
  const id = req.params.id;
  /****** Never trust users - validate input *****/
  //creates a new, empty object to be used for updating
  const updateObj = {};
  //creates an array with two values; title and content
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field => {
    //looks to see if if title and content are in the request JSON body
    if (field in req.body) {
      //declares a new property for updateObj and sets it to the value of the request body 
      updateObj[field] = req.body[field];
    }
  });
  console.log(updateObj); 
  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    else if (item !== undefined) res.json(item);
    else next(); 
  });
});


//handle search term 
app.get('/api/notes', (req, res) => {
  const {searchTerm} = req.query;
  notes.filter(searchTerm, (err, list) => {
  if (err) {
    return next(err);
    //return res.json(data.filter(item => item.title.includes(searchTerm)));
  }
  res.json(list);
  });
});

//handle returning a specific item with a given ID
app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  notes.find(id, (err, list) => {
  if (err) {
    return next(err);
  }
  else if (list !== undefined) res.json(list);
  else next();
  });
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
