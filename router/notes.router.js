const express = require('express');

const router = express.Router();

const notes = require('../db/simDB')


//updates a note 
router.put('/notes/:id', (req, res, next) => {
  //sets 'id' to the endpoint id 
  const id = req.params.id;
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
router.get('/notes', (req, res) => {
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
router.get('/notes/:id', (req, res, next) => {
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


//creates a new item
router.post('/notes', (req, res) => {
  //pulls the title and content from the request body
  const { title, content } = req.body;
  const newItem = { title, content };
  //validates the item and returns an error object if no title is provided
  if (!newItem.title) {
    const err = new Error(`Missing 'title' in the request body`);
    err.status = 400;
    return next(err);
  }
  notes.create(newItem, (err, item) => {
    if (err) return next(err);
    if (item) res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    else {
      next()
    };
  });
});

//deletes a specific item from the list of notes
router.delete('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  // if (req.body.id !== req.param(id)) {
  //   const err = new Error(`Deleted item id ${req.body.id} must match parameter id ${req.param(id)}`)
  //   err.status = 400;
  //   return next(err) 
  // }
  notes.delete(id, (err, item) => {
    if (err) {
      console.log(err);
      next(err)
    }
    if (id) {  
      console.log(`${item} item was deleted`);
      res.sendStatus(204);
    } else {
      console.log('not found');
    }
  });
});

module.exports = router; 