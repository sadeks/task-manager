process.env.NODE_ENV = 'dev';

var express = require('express');
var router = express.Router();

var tasksRepo = require('../repo/tasks');

/* GET all tasks. */
router.get('/', (req, res, next) => {
  //get all tasks and sort by createDate
  tasksRepo.getAllTasks().then((allTasks) => {
    // console.log(allTasks);
    allTasks = allTasks.length == 0 ? [] : allTasks;
    res.status(200).send(allTasks);

  }).catch((err) => {
    res.status(500).send(err);
  })

});

/* GET task by id. */
router.get('/:id', (req, res, next) => {
  // req.params.id
  tasksRepo.getTaskById(req.params.id).then( (task) => {
    // console.log('got task');
    res.status(200).send(task);

  }).catch((err) => {
    res.status(500).send(err);
  })

});

/* Update task by id. */
router.put('/:id', (req, res, next) => {

  // console.log(req.body);
  tasksRepo.getTaskById(req.params.id).then( (task) => {
    task.done = req.body.done;
    return tasksRepo.updateTaskById(req.params.id, task);
  }).then( (ok) => {
    // console.log(ok);
    res.status(200).send('ok');

  }).catch((err) => {
    res.status(500).send(err);
  })
});

/* Create New task. */
router.post('/', (req, res, next)=> {
  let newTask = req.body;
  //TODO:some validations

  //add createDate
  newTask.createDate = new Date();
  // console.log(newTask);

  tasksRepo.createNewTask(newTask).then( (ok) => {
    res.status(201).send('ok');
  }).catch((err) => {
    res.status(500).send(err);
  })
  
});

// Delete a task by id 
router.delete('/:id', (req, res, next) => {

  tasksRepo.deleteTaskById(req.params.id).then( (ok) => {
    res.status(200).send('ok');

  }).catch((err) => {
    res.status(500).send(err);
  })
});

module.exports = router;
