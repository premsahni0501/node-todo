const express = require("express");
const path = require('path');
const pdf = require('html-pdf');

// const mongoose = require('mongoose');
// const database = require("./config/database");
// // mongoose setup
// mongoose.connect(database.db, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connection.on('connected', () => {
//   console.log("connected to database " + database.db);
// })
// mongoose.connection.on('error', (err) => {
//   console.log("database error: " + err);
// })

const bodyParser = require("body-parser");

// models
// const userModel = require("./model/user.model");
// const todoModel = require("./model/todo.model");

// controllers
// const todoController = require("./controllers/todoController");
// const userController = require("./controllers/userController");

let app = express();

// setup view template engine
app.set("view engine", "ejs");

// setup static files
app.use(express.static("./public"));

// body parser setup
const urlencodedBodyParser = bodyParser.urlencoded({ extended: false })
const jsonBodyParser = bodyParser.json();
app.use(urlencodedBodyParser);
app.use(jsonBodyParser);
// app.use(expressSession({ secret: 'prem0501', saveUninitialized: false, resave: true }));

// app.get('/ionic', function (req, res) {
//   res.sendFile(__dirname + '/public/ionic/index.html');
// });
// app.get('/react', function (req, res) {
//   res.sendFile(__dirname + '/public/react/index.html');
// });

app.get('/memo-pdf', (req, res) => {
  const query = req.query;
  if (!req.query || !req.query.hasOwnProperty('data')) {
    res.send(`Data is missing`)
  }
  try {
    const json = JSON.parse(Buffer.from(query.data, 'base64').toString())
    if (!json.id) {
      res.send(`Data is missing`)
    }
    // console.log(query.data, json);
    res.render('memo.ejs', { data: json }, (err, html) => {
      console.log(err);
      if (err)
        res.send(`Data is missing/incorrect--`)
      const options = {
        format: 'A4',
        orientation: 'portrait',
        paginationOffset: 1,
        base: 'file://' + __dirname + '/public/assets/',
        zoomFactor: "0.5"
      };
      pdf
        .create(html, options)
        .toFile(`./public/assets/pdf/Memo_${json.customerDetails.displayName.split(' ').join('_')}.pdf`, (err, fileInfo) => {
          console.log(err, fileInfo);
          res.sendFile(fileInfo.filename);
        })
    })
  }
  catch (e) {
    console.log(e);
    res.send(`Data is missing/incorrect`)
  }
})
// instantiate models
// userModel(mongoose);
// todoModel(mongoose);

const port = process.env.PORT || 4000;
app.listen(port);
console.log("Server is listening on port " + port);

// fire controllers
// todoController(app, { urlencoded: urlencodedBodyParser, json: jsonBodyParser });
// userController(app, { urlencoded: urlencodedBodyParser, json: jsonBodyParser });