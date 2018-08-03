//set up an in-memory mongodb
const setup = require('./mongo_mock_stuff/setup');
const teardown = require('./mongo_mock_stuff/teardown');

const request = require('supertest');

let app;
let mockData;

describe('Test the APIs', async () => {
    //call setup constructor to set env mongourl to mock db
    beforeAll(async () => {
        //setup mongo env first before importing app 
        await setup();
        app = require('../app');
        mockData = require('./mongo_mock_stuff/mock_tasks');
        //add fake tasks
        await mockData.populateDBWithTasks();
    });

    afterAll(async () => {
        await teardown();
    });

    test('GET all tasks', () => {
        return request(app).get("/tasks").then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(3);
        });
    });

    test('Insert a new task', () => {
        let newTask = {
            title : 'new task 3',
            description: 'task decription bar foo',
            due: new Date()
        };

        return request(app)
        .post("/tasks")
        .send(newTask).then(response => {
            // console.log(response);
            let task = response.body; 
            expect(response.statusCode).toBe(201);
            expect(task.title).toEqual(newTask.title);
            expect(task.description).toEqual(newTask.description);
        });
    })
});



