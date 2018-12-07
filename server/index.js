require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const database = require('../database/index.js');
const path = require('path');
const port = 4000;

var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/../client/dist')));

app.get('/bookinglisting/id:id', (req, res) => {
  id = req.params.id;
  database
    .getData(id)
    .then(dataObj => {
      res.status(200).send(dataObj);
    })
    .catch(err => {
      res.send(err);
    });
});

//UPDATE LISTING DATA:

app.put('/change-listing/id:id', (req, res) => {
  id = req.params.id;
  var changeObj = req.params.changes;
  database.updateListing(changeObj, id).then(response => {
    console.log(response);
  });
});

//UPDATE LISTING AVAILABILITY

app.put('/change-listing/id:id', (req, res) => {
  id = req.params.id;
  var changeObj = req.params.changes;
  database.updateListing(changeObj, id).then(response => {
    console.log(response);
  });
});

//CREATE:

app.put('/create-listing/id:id', (req, res) => {
  id = req.params.id;
  var changeObj = req.params.changes;
  database.createListing(changeObj, id).then(response => {
    console.log(response);
  });
});

//UNCOMMENT TO FORCE-REBUILD DATABASE OFFSETS:

// app.get('/rebuild', (req, res) => {
//   database.rebuild().then(response => {
//     res.status(200).send(response);
//   })
// })

//SERVE INDEX AND LISTEN

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
});

return app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// })