const express = require('express');

const router = express.Router();

const notes = require('../db/simDB')


//looks at an endpoint (/api/notes/...) with a specific ID number with the purpose of updating
router.put('/:id', (req, res, next) => {
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
router.get('/', (req, res) => {
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
router.get('/:id', (req, res, next) => {
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

module.exports = router; 