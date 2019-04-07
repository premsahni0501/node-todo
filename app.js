const express = require("express");
const uuid = require('uuid/v4');

const mongoose = require('mongoose');
const database = require("./config/database");

const expressSession = require("express-session");
const FileStore = require("session-file-store")(expressSession);
const LocalStrategy = require('passport-local').Strategy;

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
app.use(expressSession({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: "prem0501", 
  saveUninitialized: true, 
  resave: false
}));
// mongoose setup
mongoose.connect(database.db, {useNewUrlParser: true });

// body parser setup
const urlencodedBodyParser = bodyParser.urlencoded({extended: false})
const jsonBodyParser = bodyParser.json();
app.use(urlencodedBodyParser);
app.use(jsonBodyParser);

// instantiate models
userModel(mongoose);
todoModel(mongoose);

// fire controllers
todoController(app, {urlencoded: urlencodedBodyParser, json: jsonBodyParser});
userController(app, {urlencoded: urlencodedBodyParser, json: jsonBodyParser});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("Server is listening on port "+port);