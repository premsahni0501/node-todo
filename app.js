let express = require("express");
let todoController = require("./controllers/todoController");

let app = express();
// setup view template engine
app.set("view engine", "ejs");
// setup static files
app.use(express.static("./public"));
// fire controllers
todoController(app);

app.listen(3000);
console.log("Server is listening on port 3000");