import { expect } from 'chai';
import supertest from 'supertest';

const request = supertest('http://localhost:8080')

describe('Testing Sessions', () => {
    
    describe('Test post login', async () => {
        const user = {
            email: 'nombre@email.com',
            password: '$2b$10$ZcHHFAAbeUTcmNT3BPC61.m7gLOAWO8oDVMeRf43qg4HDomb/EMgK'
        }
        const { statusCode, ok , body } = await request.post('/sessions/login').send({user})

        console.log(statusCode)
        console.log(ok)
        console.log(body)
    });
    describe('Test post register', async () => {
        const sendBody = {
            name: 'Post register',
            lastname: 'Test',
            email: 'test@email.com',
            age: 2024,
            password: 12345,
            confirmPassword: 12345
        }
        const { statusCode, ok , body } = await request.post('/sessions/register').send({sendBody})

        console.log(statusCode)
        console.log(ok)
        console.log(body)

    });
    describe('Test get logout', async () => {
        const { statusCode, ok , body } = await request.get('/sessions/logout')

        console.log(statusCode)
        console.log(ok)
        console.log(body)
    });
})

//npx mocha test/session.test.js