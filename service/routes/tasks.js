var express = require('express');
var router = express.Router();

const db = require('monk')(process.env.MONGO_URL);
const collection = 'Tasks';

/* GET all tasks. */
router.get('/', (req, res, next) => {

  let tasksCollection = db.get(collection);

  tasksCollection.find({}).then(allTasks => {

    res.status(200).send(allTasks);

  }).catch(err=>{
    res.status(500).send(err);
  })

});

/* GET task by id. */
router.get('/:id', (req, res, next) => {
  // req.params.id
  //var task = tasks.find(o=>o.id == req.params.id);

  let tasksCollection = db.get(collection);

  tasksCollection.find({ id: req.params.id }).then( task => {
    res.status(200).send(task);

  }).catch(err => {
    res.status(500).send(err);
  })

});

/* Update task by id. */
router.put('/:id', (req, res, next) => {

  let tasksCollection = db.get(collection);

  tasksCollection.update({ id: req.params.id }, { done: req.body.done }).then( ok => {
    res.status(200).send('ok');

  }).catch(err => {
    res.status(500).send(err);
  })
});

/* Create New task. */
router.post('/', (req, res, next)=> {
  // do some validations
  //create

  let tasksCollection = db.get(collection);

  const newTask = req.body;

  tasksCollection.insert(newTask).then( ok => {
    res.status(201).send('ok');

  }).catch(err => {
    res.status(500).send(err);
  })
  
});

// Delete a task by id 
router.delete('/:id', (req, res, next) => {

  let tasksCollection = db.get(collection);
  tasksCollection.remove({ id: req.params.id }).then( ok => {
    res.status(200).send('ok');

  }).catch(err => {
    res.status(500).send(err);
  })
});

module.exports = router;
