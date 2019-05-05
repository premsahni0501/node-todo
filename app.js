const express = require("express");
const expressSession = require("express-session");

const mongoose = require('mongoose');
const database = require("./config/database");
// mongoose setup
mongoose.connect(database.db, {useNewUrlParser: true });
mongoose.connection.on('connected', ()=>{
  console.log("connected to database "+database.db);
})
mongoose.connection.on('error', (err)=>{
  console.log("database error: "+err);
})

const bodyParser = require("body-parser");

// models
const userModel = require("./model/user.model");
const todoModel = require("./model/todo.model");

// controllers
const todoController = require("./controllers/todoController");
const userController = require("./controllers/userController");

let app = express();

// setup view template engine
app.set("view engine", "ejs");

// setup static files
app.use(express.static("./public"));

// body parser setup
const urlencodedBodyParser = bodyParser.urlencoded({extended: false})
const jsonBodyParser = bodyParser.json();
app.use(urlencodedBodyParser);
app.use(jsonBodyParser);
app.use(expressSession({secret: 'prem0501', saveUninitialized: false, resave: true }));

app.get('/ionic', function(req, res){
  res.sendFile(__dirname + '/public/ionic/index.html');
});
app.get('/react', function(req, res){
  res.sendFile(__dirname + '/public/react/index.html');
});
// instantiate models
userModel(mongoose);
todoModel(mongoose);

const port = process.env.PORT || 3000;
app.listen(port);
console.log("Server is listening on port "+port);

// fire controllers
todoController(app, {urlencoded: urlencodedBodyParser, json: jsonBodyParser});
userController(app, {urlencoded: urlencodedBodyParser, json: jsonBodyParser});