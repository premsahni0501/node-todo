let bodyParser = require("body-parser");
let mongoose = require('mongoose');
const database = require("../config/database");
console.log(database.db);
mongoose.connect(database.db, {useNewUrlParser: true });

let todoSchema = new mongoose.Schema({
    item: String
});
let Todo = mongoose.model("Todo", todoSchema);

let jsonBodyParser = bodyParser.json({extended: false});

const getAllTodos = (req, res, dataOnly, successMsg) => {
    Todo.find({}, (err, data)=>{
        if(err){
            if(dataOnly == true){
                res.json({status: 0,msg: "Something went wrong, please tru after some time.", response: []})
            }
            else{
                res.render("todo", {todos: []});
            }
        }
        else{
            if(dataOnly == true){
                res.json({status: 1,msg: successMsg, response: data.reverse()})
            }
            else{
                res.render("todo", {todos: data.reverse()});
            }
        }
    })
}
module.exports = (app)=>{
    app.get("/", (req, res)=>{
        getAllTodos(req, res, false, "Success");
    })
    app.get("/todo", (req, res)=>{
        getAllTodos(req, res, false, "Success");
    });
    app.post("/todo", jsonBodyParser, (req, res)=>{
        console.log(req.body);
        if(req.body != "" || req.body != null){
            Todo(req.body).save((err)=>{
                if(err){
                    res.json({status: 0, msg: "Failed to add todo item"});
                }
                else{
                    getAllTodos(req, res, true, "Item Added successfully");
                }
            })
        }
        else{
            res.json({status: 0, msg: "No Item provided."});
        }

    });
    app.post("/update-todo", jsonBodyParser, (req, res)=>{
        console.log(req.body.id, req.body.content);
        if(req.body != "" || req.body != null){
            Todo.where({_id: req.body.id}).updateOne({item: req.body.content}, (err, data)=>{
                if(err){
                    res.json({status: 0, msg: "Failed to add todo item"});
                }
                else{
                    console.log(data);
                    getAllTodos(req, res, true, "Item Updated successfully");
                }
            })
        }
        else{
            res.json({status: 0, msg: "No Item provided."});
        }

    });
    app.delete("/todo/:item", (req, res)=>{
        if(req.params.item != ""){
            Todo.find({_id: req.params.item}).deleteOne((err, data)=>{
                if(err){
                    res.json({status: 0, msg: "Failed to delete item."});
                }
                else{
                    getAllTodos(req, res, true, "Item deleted successfully");
                }
            })
        }
    });
}