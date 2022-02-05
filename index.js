const express = require('express');
//const orders = require('./dc-orders.json');
//const products = require('./.json')
//const customers = require('./Customers.json');

const { initializeApp, getApps, cert } = require('firebase-admin/app');//were bringing in getApps to check in see if its already conected
const { getFirestore } = require('firebase-admin/firestore');

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;

const credentials = require('./credentials.json');

initializeApp({
    credential: cert(credentials)
});


function connectToFirestore() {
    if (!getApps().length) {
        //check and see if its already connect and if NOT then connect, but still connect to firestore
        initializeApp({
            credential: cert(credentials)
        });
    }
    return getFirestore();}


app.get('/customer', (req, res) => {
    const db = connectToFirestore();
    db.collection('dc-customers').get()
        .then(snapshot => {
            const customers = snapshot.docs.map(doc => { //
                let customer = doc.data();
                customer.id = doc.id
                return customer
            })
            res.status(200).send(customers)
        })
        .catch(console.end);
})

app.get('/order', (req, res) => {
    const db = connectToFirestore();
    db.collection('dc-orders').get()
        .then(snapshot => {
            const orders = snapshot.docs.map(doc => { //
                let order = doc.data();
                order.id = doc.id
                return order
            })
            res.status(200).send(orders)
        })
        .catch(console.end);
})
app.get('/product', (req, res) => {
    const db = connectToFirestore();
    db.collection('dc-products').get()
        .then(snapshot => {
            const products = snapshot.docs.map(doc => { //
                let product = doc.data();
                product.id = doc.id
                return product
            })
            res.status(200).send(products)
        })
        .catch(console.end);
})



app.post('/customer', (request, response) => {
    const db = connectToFirestore()
    db.collection('dc-customers')
        .add(request.body)
        .then(() => response.send("customer created"))
        .catch(console.error)
})

app.post('/product', (request, response) => {
    const db = connectToFirestore()
    db.collection('dc-products')
        .add(request.body)
        .then(() => response.send("products added"))
        .catch(console.error)
})

app.post('/order', (request, response) => {
    const db = connectToFirestore()
    db.collection('dc-orders')
        .add(request.body)
        .then(() => response.send("Brand new order"))
        .catch(console.error)
})

app.listen(3000, () => {
    console.log('API listening on port 3000')
})

// Read a whole collection

app.get('/customer', (request, response) => {
    const db = connectToFirestore()
    db.collection('dc-customers')
        .get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.id, "=>", doc.data())
            })

        }).catch(err => console.error(err))

})

//Read a single Doc

app.get('/product/:id', (request, response) => {
    const { id } = request.params;
    const db = connectToFirestore()
    db.collection('dc-products').doc(id).get()
        .then(doc => {
            let prod = doc.data()
            prod.id = doc.id
            response.send(prod);
        })
        .catch(err => console.error(err));
})

app.patch('/order/:id', (request,response) => {
    const db = connectToFirestore()
    const { id} = request.params
    const { products: [{ price, quantity }] } = request.body
    console.log(request.body)
    db.collection('dc-orders')
    .doc(id)
    .update({products: [{ price, quantity }]})
    .then(() => response.send("order updated"))
    .catch(console.error)
})


