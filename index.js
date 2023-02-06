const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const port = process.env.PORT || 5000;
require('dotenv').config();

//middle ware
app.use(cors())
app.use(express.json())


app.get('/', async(req, res)=>{
    res.send('server is runing...')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epqkzkd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {

        const productsDataCollection = client.db('moon_tech_redux_project').collection('allProducts');

         //category get api
        app.get('/allProducts', async(req, res)=>{
            const query = {};
            const products = await productsDataCollection.find(query).toArray();
            res.send(products)
        })
        
        app.post('/addProducts', async(req, res)=>{
            const body = req.body;
            const products = await productsDataCollection.insertOne(body);
            res.send(products)
        })

        app.delete('/allProducts/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const products = await productsDataCollection.deleteOne(query);
            res.send(products)
        })

        app.put('/allProducts/:id', async(req, res)=>{
            const body = req.body;
            const id = req.params.id;
            console.log(id)
            const filter = {_id: ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: body
                
              };
            const products = await productsDataCollection.updateOne(filter, updateDoc, options);
            res.send(products)
        })
        
       
        
        
    } catch (error) {
        console.log(error.message)
    }
}
run().catch(console.log)



app.listen(port, () => {
    console.log(`server is running ${port}`)
  })