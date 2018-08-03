//set up an in-memory mongodb
const setup = require('./mongo_mock_stuff/setup');
const teardown = require('./mongo_mock_stuff/teardown');

const request = require('supertest');

let app;
let mockData;
let insertedMockTasks;

describe('Test the APIs', async () => {
    //call setup constructor to set env mongourl to mock db
    beforeAll(async () => {
        //setup mongo env first before importing app 
        await setup();
        app = require('../app');
        mockData = require('./mongo_mock_stuff/mock_tasks');
        //add fake tasks
        insertedMockTasks = await mockData.populateDBWithTasks();
    });

    afterAll(async () => {
        await teardown();
    });

    test('GET all tasks', () => {
        return request(app).get("/tasks").then(response => {
            let tasks = response.body;
            expect(response.statusCode).toBe(200);
            expect(tasks.length).toBe(3);
        });
    });

    test('GET existing task by id', () =>{
        //grab an existing id from the db to fetch
        let id = insertedMockTasks[0]._id.toString();
        // console.log(insertedMockTasks);
        return request(app)
        .get('/tasks/'+id)
        .then(response => {
            let fetchedTask = response.body;
            expect(response.statusCode).toBe(200);
            expect(fetchedTask._id).toEqual(id);
        })

    })

    test('Insert a new task', () => {
        let newTask = {
            title : 'new task 3',
            description: 'task decription bar foo',
            due: new Date()
        };

        return request(app)
        .post("/tasks")
        .send(newTask).then(response => {
            
            let task = response.body; 
            expect(response.statusCode).toBe(201);
            // test title and description
            expect(task.title).toEqual(newTask.title);
            expect(task.description).toEqual(newTask.description);
        });
    });

    test('Update existing task by id', () =>{
        //grab the first task's id to update
        let id = insertedMockTasks[0]._id.toString();
        // console.log(insertedMockTasks);
        return request(app)
        .put('/tasks/'+id)
        .send({ done: true }).then(response=>{
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(1);
            expect(response.body.n).toBe(1);
        })

    });

    test('Delete existing task by id', () => {
        //grab the first task's id to update
        let id = insertedMockTasks[0]._id.toString();
        // console.log(insertedMockTasks);
        return request(app)
        .delete('/tasks/'+id)
        .then(response=>{
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(1);
            expect(response.body.n).toBe(1);
        })

    })
});



