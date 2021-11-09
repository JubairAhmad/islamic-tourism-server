const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()


const app = express()
const port =process.env.PORT|| 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0uqqq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tourAndTravels");
        const shedulesCollection = database.collection("shedules");
        const bookingCollection = database.collection("booking");
        const confromCollection = database.collection("confrom");

        // get api
        app.get('/shedules',async(req, res)=>{
            const cursor = shedulesCollection.find({});
            const services= await cursor.toArray();
            res.send(services)
        })

        // get single api
        app.get('/shedules/:id', async(req, res)=>{
            const id= req.params.id;
            // console.log(id);
            const query={ _id: ObjectId(id) };
            
            const service =await shedulesCollection.findOne(query);
            // console.log(service);
            res.json(service)
        })


        // post api 
        app.post ('/shedules',async(req, res)=>{
            const service=req.body;
            // console.log('hitted the post',service);
            const result = await shedulesCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        })

        //UPDATE API
        app.put('/shedules/:id', async (req, res) => {
          const id = req.params.id;
          const updatedUser = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                  name: updatedUser.name,
                  name: updatedUser.description,
                  name: updatedUser.price,
                  name: updatedUser.img,
                  name: updatedUser.duretion,
              },
          };
          const result = await shedulesCollection.updateOne(filter, updateDoc, options)
          // console.log('updating', id)
          res.json(result)
      })

        // delete api
        app.delete('/shedules/:id', async(req, res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result = await shedulesCollection.deleteOne(query);
            res.json(result)
        })


        // add booking
        app.post('/booking',(req,res)=>{
            // console.log(req.body);
            bookingCollection.insertOne(req.body).then((result)=>{
              res.send(result);
            });
  
  
         });

         app.get('/myOders/:email', async(req,res)=>{
            // console.log(req.params.email);
            const result =await bookingCollection
            .find({email: req.params.email})
            .toArray();
            res.send(result);
        });
         //delete from my order
     app.delete('/deleteProduct/:id', async(req,res)=>{
        // console.log(req.params.id);
        const result =await bookingCollection.deleteOne({
          _id:ObjectId(req.params.id),
       });
      //  console.log(result);
      });

           // confrom order
           app.post('/confrom', async(req,res)=>{
            // console.log('confrom')
            const orderConfrom=req.body;
            // console.log('hit the psot api',orderConfrom);

            const result =await confromCollection.insertOne(orderConfrom)
            // console.log(result);
          res.send(result)
          })

    } finally {
        // await client.close();
      }

 


}


run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`ami tore dekhtaci eikhan theikha`, port)
})