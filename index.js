const { MongoClient, Admin } = require("mongodb");
const Objectid = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors');
require("dotenv").config();

// USED FOR READING FILE IN EXPRESS//
const fileUpload = require('express-fileupload')

const app = (express())





const port = process.env.PORT || 9000;


app.use(express.json())
app.use(cors())
app.use(fileUpload())


// MONGO DB CONNECTION URI ////

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// MONGO CLIENT ///

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// MAIN PROCESS START //

async function run() {
  try {

    // Check Connections //
    console.log("connected");
    // DATABASE NAME AND CHILDS ///
    const database = client.db('Cust-Club');
    // UpcommingEvents// 
    const UpcommingEventsCollection = database.collection('UpCommingEvents');

    // Current EVENT //
    const CurrentEventsCollection = database.collection('currentEvents');
    const UsersCollection=database.collection('Users')
    const NoticeCollection=database.collection('Notice');




    // current  Event Data Processing Start //

    // GET EVENTS DATA ///
    app.get('/currentevents', async (req, res) => {

      const cursor = CurrentEventsCollection.find({});
      const result = await cursor.toArray();
      res.json(result)
    })

    // POST EVENT DATA INTO DATABASE //
    app.post('/currentevents', async (req, res) => {
      // Rcive data from front end //
      const data = req.body;
      const title = data.title;
      const time = data.time;
      const description = data.description;
      // Recive file with data// 
      const files = req.files.image.data;
      // Process ImageFille with base64 Encrytion ///
      const encodedImage = files.toString('base64');
      const imageBuffer = Buffer.from(encodedImage, "base64");

      // Create Event Object and store in mongoDb //

      const event = {
        time, title, description,
        image: imageBuffer
      };


      // Insert the object in databse///
      const result = await CurrentEventsCollection.insertOne(event)

      // send respons to user //
      res.json(result)

    })

    // Current Event Data Processing ENd ///


    // UpcommingEvent Data Procesing Start ///

    app.post('/comingevents', async (req, res) => {
      // Rcive data from front end //
      const data = req.body;
      const title = data.title;
      const time = data.time;
      const description = data.description;
      // Recive file with data// 
      const files = req.files.image.data;
      // Process ImageFille with base64 Encrytion ///
      const encodedImage = files.toString('base64');
      const imageBuffer = Buffer.from(encodedImage, "base64");

      // Create Event Object and store in mongoDb //

      const event = {
        time, title, description,
        image: imageBuffer
      };
      // Insert the object in databse///
      const result = await UpcommingEventsCollection.insertOne(event)
      // send respons to user //
      res.json(result)
    })


    // Get Current Events //

    app.get('/comingevents', async (req, res) => {
      const cursor = UpcommingEventsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    })

    // UpcommingEvent Data Procesing End ///

    // DELETE current EVENT ////

    app.delete('/currentevents/:id', async (req, res) => {

      const id = req.params.id;
      const query={_id: Objectid(id)}
       
      const result=await CurrentEventsCollection.deleteOne(query);

      res.send(result)
    })


    // EVENTS PROCESSING END ///

    // Manage Users ///

    // POST USER DATA //
 app.post('/users', async (req,res)=>{

  const user=req.body;

        const result=await UsersCollection.insertOne(user);

        res.send(result)
 }) 

//  CHECK IF LOGEDING USER IS ADMIN //
        
 app.get('/user/admin/:email', async(req,res)=>{

  const email= req.params.email;
   let isAdmin=false
  const query={email:email}
  const user=await UsersCollection.findOne(query);

  if(user?.role==="admin"){
    isAdmin=true

  }

  res.json({admin : isAdmin})
})

 
// POST NOTICE //
 app.post('/notice',async(req,res)=>{
  const notice=req.body;
  const result=await NoticeCollection.insertOne(notice);

  res.json(result)

 })

 app.get('/notice',async(req,res)=>{
const cursor=NoticeCollection.find({});
const result=await cursor.toArray();
res.send(result);

 })

  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);







//   Check Server Is rurring ///

app.get('/', async (req, res) => {

  res.send("server Running too efficiently")


})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

