const express = require('express');
const app = express();
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// const URL = 'mongodb://localhost:27017'; //===>Here also we can mention our db name
const URL =
  'mongodb+srv://Jose:IA3wGNw4fXllQPrt@josephcluster.sasww.mongodb.net/usersdata?retryWrites=true&w=majority';

let options = {
  origin: '*',
};
app.use(cors(options));
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    //CONNECT TO MONGODB
    const connection = await MongoClient.connect(URL);
    //SELECT THE DATABASE
    const db = connection.db('usersdata'); //?=>will not return a promise if we want this as promise we can use exec()
    //SELECT THE COLLECTION DO THE REQUIRED OPERTATION
    let userData = await db.collection('users').find({}).toArray();
    await connection.close();
    console.log({ userData });
    res.json(userData);
  } catch (error) {
    console.log(error);
  }
});

app.post('/addusers', async (req, res) => {
  try {
    //connection to Mongo DB
    const connection = await MongoClient.connect(URL);

    //select the database
    const db = connection.db('usersdata');

    //select the collection and do the required operation
    await db.collection('users').insertOne(req.body);
    //close the connection
    await connection.close();

    res.json({ message: 'user Added Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'DATA BASE ERROR' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db('usersdata');
    let objId = mongodb.ObjectId(req.params.id);
    let user = await db.collection('users').findOne({ _id: objId });
    await connection.close();
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db('usersdata');
    let objId = mongodb.ObjectId(req.params.id);
    await db.collection('users').updateOne({ _id: objId }, { $set: req.body });
    await connection.close();
    res.json({ message: 'UserEdited Successfully' });
  } catch (error) {
    console.log(error);
  }
});

app.delete('/users/delete/:id', async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db('usersdata');
    let objId = mongodb.ObjectId(req.params.id);
    await db.collection('users').deleteOne({ _id: objId });
    await connection.close();
    res.json({ message: 'user Deleted Successfully' });
  } catch (error) {
    console.log(error);
  }
});
app.listen(process.env.PORT || 5000);

//ANOTHER LOGIC TOLD BY MENTOR FOR EDIT USING ID

// app.put('/users/edit/:id', (req, res) => {
//getting the index
//   let index = userList.findIndex((obj) => obj.id === req.params.id);

//   Object.keys(
//     userList[index].array.forEach((element) => {
//       userList[index][element] = req.body[element];
//     })
//   );
// });
