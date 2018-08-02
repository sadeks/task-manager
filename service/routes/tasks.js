var express = require('express');
var router = express.Router();

const db = require('monk')(process.env.MONGO_URL);
const collection = 'tasks';


/* GET all tasks. */
router.get('/', (req, res, next) => {
  let tasksCollection = db.get(collection);
  tasksCollection.find({}, { sort: { createDate : -1} }).then((allTasks) => {
    // console.log(allTasks);
    allTasks = allTasks.length == 0 ? [] : allTasks;
    res.status(200).send(allTasks);

  }).catch(err=>{
    res.status(500).send(err);
  })

});

/* GET task by id. */
router.get('/:id', (req, res, next) => {
  // req.params.id
  let tasksCollection = db.get(collection);

  tasksCollection.findOne({ _id: req.params.id }).then( (task) => {
    res.status(200).send(task);

  }).catch(err => {
    res.status(500).send(err);
  })

});

/* Update task by id. */
router.put('/:id', (req, res, next) => {

  let tasksCollection = db.get(collection);
  console.log(req.body);

  //find the task first
  tasksCollection.findOne({ _id: req.params.id }).then( (task) => {
    //update the task
    task.done = req.body.done;
    return tasksCollection.update({ _id: req.params.id },  task );
  }).then( (ok) => {
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

  let newTask = req.body;
  //add createDate
  newTask.createDate = new Date();

  // console.log(newTask);

  tasksCollection.insert(newTask).then( ok => {
    res.status(201).send('ok');

  }).catch(err => {
    res.status(500).send(err);
  })
  
});

// Delete a task by id 
router.delete('/:id', (req, res, next) => {

  let tasksCollection = db.get(collection);
  tasksCollection.remove({ _id: req.params.id }).then( ok => {
    res.status(200).send('ok');

  }).catch(err => {
    res.status(500).send(err);
  })
});

module.exports = router;
