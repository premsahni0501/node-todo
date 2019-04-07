const todoModel = require("../model/todo.model")
module.exports = (app, bodyParser)=>{
    const getAllTodos = (req, res, dataOnly, successMsg) => {
        todoModel.findAllTodos({}, (err, data)=>{
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

    app.get("/", (req, res)=>{
        console.log(req.sessionID);
        getAllTodos(req, res, false, "Success");
    })
    app.get("/todo", (req, res)=>{
        getAllTodos(req, res, false, "Success");
    });
    app.post("/todo", bodyParser.json, (req, res)=>{
        console.log(req.body);
        if(req.body != "" || req.body != null){
            todoModel.saveTodo(req.body, (err)=>{
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
    app.post("/update-todo", bodyParser.json, (req, res)=>{
        console.log(req.body.id, req.body.content);
        if(req.body != "" || req.body != null){
            todoModel.updateTodo({_id: req.body.id}, {item: req.body.content}, (err, data)=>{
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
            todoModel.deleteTodo({_id: req.params.item}, (err, data)=>{
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