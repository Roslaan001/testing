let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, { 'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// Connection settings
const mongoUrl = process.env.MONGO_URL || "mongodb://AGeTbBL0s4nv:ipxCtDMqRR1dEstSa64E1NO4p@merry.igris.cloud:37382/admin";
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const databaseName = "user-account";
const collectionName = "users";

app.get('/get-profile', function (req, res) {
  MongoClient.connect(mongoUrl, mongoClientOptions, function (err, client) {
    if (err) {
      console.error('Mongo connection error:', err);
      return res.status(500).send({ error: 'Database connection failed' });
    }

    const db = client.db(databaseName);
    db.collection(collectionName).findOne({ userid: 1 }, function (err, result) {
      client.close();
      if (err) return res.status(500).send({ error: 'Query failed' });
      res.send(result || {});
    });
  });
});

app.post('/update-profile', function (req, res) {
  let userObj = req.body;
  userObj['userid'] = 1;

  MongoClient.connect(mongoUrl, mongoClientOptions, function (err, client) {
    if (err) {
      console.error('Mongo connection error:', err);
      return res.status(500).send({ error: 'Database connection failed' });
    }

    const db = client.db(databaseName);
    db.collection(collectionName).updateOne(
      { userid: 1 },
      { $set: userObj },
      { upsert: true },
      function (err, result) {
        client.close();
        if (err) return res.status(500).send({ error: 'Update failed' });
        res.send(userObj);
      }
    );
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
