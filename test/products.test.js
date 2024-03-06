import { expect } from 'chai';
import supertest from 'supertest';

const request = supertest('http://localhost:8080')

describe('Testing Products', () => {

    describe('Test post addProduct', async () => {
        const product = {
                title: 'title test', 
                description: 'description test', 
                price: 111, 
                thumbnail: 'thumbnail test', 
                code: 111, 
                stock: 111
        }
        const { statusCode, ok , body } = await request.post('/api/products').send({product})

        console.log(statusCode)
        console.log(ok)
        console.log(body)
    });
    describe('Test get getProducts', async () => {
        
        const { statusCode, ok , body } = await request.get('/api/products')

        console.log(statusCode)
        console.log(ok)
        console.log(body)

    });
    describe('Test get getProductById', async () => {
        const _id ='6567ce666a0282d2efabd234'
        const { statusCode, ok , body } = await request.get(`/api/products/${_id}`)

        console.log(statusCode)
        console.log(ok)
        console.log(body)
    });
})

//npx mocha test/products.test.js