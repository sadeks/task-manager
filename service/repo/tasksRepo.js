
const db = require('monk')(process.env.MONGO_URL);
const collection = 'tasks';

const tasksCollection = db.get(collection);


var getAllTasks = () => {
    return tasksCollection.find({}, { sort: { createDate : -1} });
}

var getTaskById = (id) => {
    return tasksCollection.findOne({ _id: id });
}

var updateTaskById = (id, updatedTask) => {
    return tasksCollection.update({ _id: id },  updatedTask );
}

var createNewTask = (newTask) =>{
    return tasksCollection.insert(newTask);
}

var deleteTaskById = (id) => {
    return tasksCollection.remove({ _id: id });
}

module.exports = {
    getAllTasks: getAllTasks,
    getTaskById: getTaskById,
    updateTaskById: updateTaskById,
    createNewTask: createNewTask,
    deleteTaskById: deleteTaskById
}