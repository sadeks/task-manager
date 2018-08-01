var express = require('express');
var router = express.Router();

// const redisClient = require('../client/redis-client');
const redis = require('redis');
// const bluebird = require('bluebird');
// bluebird.promisifyAll(redis);

const redisClient = redis.createClient(process.env.REDIS_URL);
// var tasks = [
//   {
//     id: '1234',
//     title: 'task 1',
//     due: new Date('2018/07/29'),
//     done: false
//   },
//   {
//   id: '1234',
//   title: 'task 1',
//   due: new Date('2018/07/30'),
//   done: false
// },
// {
//   id: '1234353',
//   title: 'task 1',
//   due: new Date('2018/07/31'),
//   done: false
// },
// {
//   id: '12342343',
//   title: 'task 343',
//   due: new Date('2018/08/01'),
//   done: false
// },
// {
//   id: '2234',
//   title: 'task 2',
//   due: new Date('2018/08/02'),
//   done: false
// },
// {
//   id: '223565',
//   title: 'task 3 title ex',
//   due: new Date('2018/08/03'),
//   done: false
// },
// {
//   id: '2235653',
//   title: 'task 43 title eaasx',
//   due: new Date('2018/08/04'),
//   done: false
// }];

/* GET all tasks. */
router.get('/', (req, res, next) => {
  let tasks = [];

  //get all keys first. then iterate to get tasks
  redisClient.hgetall('*', (err, obj)=>{
    if (err){
      res.status(500).send(err);
    }
    console.log(obj);
  });

  res.send(tasks);
});

/* GET task by id. */
router.get('/:id', (req, res, next) => {
  // req.params.id
  //var task = tasks.find(o=>o.id == req.params.id);

  var task = redisClient.get(req.params.id);

  res.send(task);
});

/* Update task by id. */
router.put('/:id', (req, res, next) => {
  // find task by id
  // console.log(req.body.done);
  // tasks.find(i=>i.id==req.params.id).done = req.body.done;
  var updateQry = { done: req.body.done };
  redisClient.set(req.params.id, { done: JSON.stringify(updateQry) });
  //update done status with 
  //save
  //return ok 200
  res.status(200).send("OK");
});

/* Create New task. */
router.post('/', (req, res, next)=> {
  // do some validations
  //create
  //return ok 200
  // console.log(req.body);

  var taskId = req.body.id;
  redisClient.hmset(taskId, req.body);
  //await redisClient.setAsync(taskId, { done: JSON.stringify(req.body) });
  // tasks.push(req.body);
  res.status(201).send("OK");
});

module.exports = router;
