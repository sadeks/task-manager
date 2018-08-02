const request = require('supertest');
const app = require('../app');

describe('Test the APIs', () => {
    test('GET all tasks', (done) => {
        console.log('hola');
        return request(app).get("/tasks").then(response => {
            console.log(response);
            expect(response.body.length).toBe(2);
            expect(response.statusCode).toBe(200)
            done();
        })
    });
});