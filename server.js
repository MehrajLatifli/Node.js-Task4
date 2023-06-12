const express = require('express')
const os = require("node:os")
const geoip = require('geoip-lite');
require('dotenv').config();
const axios = require("axios")
const Products = require('./models/products');
const Producers = require('./models/producer');

const app = express()

// middlware json requests
app.use(express.json())


const producers = [];

const producer1 = new Producers(1, 'Producer 1');
const producer2 = new Producers(2, 'Producer 2');
const producer3 = new Producers(3, 'Producer 3');
const producer4 = new Producers(4, 'Producer 4');

producers.push(producer1);
producers.push(producer2);
producers.push(producer3);
producers.push(producer4);

const products = [];



const product1 = new Products(1, 'Title 1', 'Description 1', 'Category 1', producer1.id);

const product2 = new Products(1, 'Title 2', 'Description 2', 'Category 2', producer2.id);

const product3 = new Products(1, 'Title 3', 'Description 3', 'Category 3', producer3.id);

const product4 = new Products(1, 'Title 4', 'Description 4', 'Category 4', producer4.id);

const product5 = new Products(1, 'Title 5', 'Description 5', 'Category 5', producer1.id);

const product6 = new Products(1, 'Title 6', 'Description 6', 'Category 6', producer2.id);

const product7 = new Products(1, 'Title 7', 'Description 7', 'Category 7', producer3.id);

const product8 = new Products(1, 'Title 8', 'Description 8', 'Category 8', producer4.id);


products.push(product1);
products.push(product2);
products.push(product3);
products.push(product4);
products.push(product5);
products.push(product6);
products.push(product7);
products.push(product8);



app.get('/products', (req, res) => {

    
    res.json(products)
})


app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const product = products.find(product => product.id === id);

    if (!product) {

        return res.status(404).json({ error: 'product not found' });
    }


    res.json(product);
});


app.post('/products', (req, res)=> {

   
    const {id, title, description, category, producerId} =req.body


    products.push( {id, title, description, category, producerId});

    res.json(product)
})



app.delete('/products/:id', (req, res) => {

    const id = parseInt(req.params.id);


    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) {

        return res.status(404).json({ error: 'product not found' });
    }

    products.splice(productIndex, 1);


    res.json(products);
});




app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);


    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) {

        return res.status(404).json({ error: 'product not found' });
    }


    products[productIndex] = { ...products[productIndex], ...req.body };


    res.json(products[productIndex]);
});




app.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);


    const product = products.find(product => product.id === id);

    if (!product) {

        return res.status(404).json({ error: 'product not found' });
    }


    product.title = req.body.title;
    product.description = req.body.description;
    product.category = req.body.category;


    res.json(product);
});





app.get('/producers', (req, res) => {

    res.json(producers)
})


app.get('/producers/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const producer = producers.find(producer => producer.id === id);

    if (!producer) {

        return res.status(404).json({ error: 'producer not found' });
    }


    res.json(producer);
});


app.post('/producers', (req, res)=> {

    const {id, name} =req.body

    producers.push( {id, name});

    res.json(producers)
})


app.delete('/producers/:id', (req, res) => {
    const id = parseInt(req.params.id);


    const producerIndex = producers.findIndex(producer => producer.id === id);
    if (producerIndex === -1) {
        return res.status(404).json({ error: 'Producer not found' });
    }

   
    const deletedProducer = producers.splice(producerIndex, 1)[0];


    products.forEach(product => {
        if (product.producerId === deletedProducer.id) {
            product.producerId = null;
        }
    });

    res.json({ message: 'Producer deleted successfully' });
});




app.put('/producers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedProducer = req.body;

    // Find the producer to be updated
    const producerIndex = producers.findIndex(producer => producer.id === id);
    if (producerIndex === -1) {
        return res.status(404).json({ error: 'Producer not found' });
    }


    producers[producerIndex] = { ...producers[producerIndex], ...updatedProducer };


    products.forEach(product => {
        if (product.producerId === id) {
            product.producerId = updatedProducer.id;
        }
    });

    res.json(producers[producerIndex]);
});




app.patch('/producers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedProducer = req.body;

   
    const producer = producers.find(producer => producer.id === id);
    if (!producer) {
        return res.status(404).json({ error: 'Producer not found' });
    }


    producer.name = updatedProducer.name;

    products.forEach(product => {
        if (product.producerId === id) {
            product.producerId = updatedProducer.id;
        }
    });

    res.json(producer);
});




app.listen(process.env.PORT, () => {
    console.log(`Server is running on: localhost:${process.env.PORT}`)   // npm run start
})