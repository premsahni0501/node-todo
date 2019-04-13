const todoModel = require("../model/todo.model");
const userModel = require("../model/user.model");

module.exports = (app, bodyParser)=>{
    const getAllTodos = (userId, req, res, dataOnly, successMsg) => {
        // console.log("userId", userId);
        todoModel.findAllTodos({userId: userId}, (err, data)=>{
            if(err){
                if(dataOnly == true){
                    res.json({status: 0,msg: "Something went wrong, please try after some time.", data: {todoData: []}})
                }
                else{
                    res.render("todo", {status: 0,msg: "Something went wrong, please try after some time.", data: {todoData: []}})
                }
            }
            else{
                const todoData = data?data.reverse():[];
                // console.log("all todo", todoData);
                if(dataOnly == true){
                    res.json({msg: successMsg, status: 1, data: {todoData: todoData}});
                }
                else{
                    userModel.findUserById({_id: userId}, (err, userData)=>{
                        if(!err){
                            res.render("todo", {msg: '', status: 1, data: {todoData: todoData, userData: userData}});
                        }
                        else{
                            res.render("/auth");
                        }
                    })
                }
            }
        })
    }

    app.get("/", (req, res)=>{
        if(req.session.userSessionId == '' || req.session.userSessionId == null){
            res.redirect("/auth");
        }
        else{
            res.redirect(`/todo/${req.session.userSessionId}`);
        }
    })
    app.get("/todo/:userId", (req, res)=>{
        if(req.session.userSessionId == '' || req.session.userSessionId == null){
            res.redirect("/auth");
        }
        else{
            console.log(req.params.userId);
            getAllTodos(req.params.userId, req, res, false, "Success");
        }
    });
    app.post("/todo", bodyParser.json, (req, res)=>{
        if(req.body != "" || req.body != null){
            todoModel.saveTodo(req.body, (err)=>{
                if(err){
                    res.json({status: 0, msg: "Failed to add todo item"});
                }
                else{
                    getAllTodos(req.body.userId, req, res, true, "Item Added successfully");
                }
            })
        }
        else{
            res.json({status: 0, msg: "No Item provided."});
        }

    });
    app.post("/update-todo", bodyParser.json, (req, res)=>{
        console.log("update", req.body.id, req.body.content);
        if(req.body != "" || req.body != null){
            todoModel.updateTodo({_id: req.body.id, userId: req.body.userId}, {item: req.body.content}, (err, data)=>{
                if(err){
                    res.json({status: 0, msg: "Failed to add todo item"});
                }
                else{
                    getAllTodos(req.body.userId, req, res, true, "Item Updated successfully");
                }
            })
        }
        else{
            res.json({status: 0, msg: "No Item provided."});
        }

    });
    app.delete("/todo", bodyParser.json, (req, res)=>{
        if(req.body.itemId != "" && req.body.userId != ""){
            todoModel.deleteTodo({_id: req.body.itemId, userId: req.body.userId}, (err, data)=>{
                if(err){
                    res.json({status: 0, msg: "Failed to delete item."});
                }
                else{
                    getAllTodos(req.body.userId, req, res, true, "Item deleted successfully");
                }
            })
        }
    });
}