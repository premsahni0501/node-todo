let bodyParser = require("body-parser");
let jsonBodyParser = bodyParser.json({extended: false});
let todoData = [
    {
        "item": "get milk"
    },
    {
        "item": "walk dog"
    },
    {
        "item": "kick some coding ass"
    }
];
module.exports = (app)=>{
    app.get("/todo", (req, res)=>{
        res.render("todo", {todos: todoData});
    });
    app.post("/todo", jsonBodyParser, (req, res)=>{
        console.log(req.body);
        if(req.body != "" || req.body != null){
            if(todoData.findIndex(item => item.item == req.body.item) == -1){
                todoData.push(req.body);
                res.json({status: 1, message: "Item added successfully.", data: todoData.reverse()});
            }else{
                res.json({status: 1, message: "Item already exists", data: todoData});
            }
        }
        else{
            res.json({status: 0, message: "Failed to add item."});
        }

    });
    app.delete("/todo/:item", (req, res)=>{
        if(req.params.item != ""){
            todoData = todoData.filter(item=>{
                return item.item.replace(/ /g, "-") !== req.params.item;
            });
            res.json({status: 1, message: "Item removed successfully.", data: todoData});
            return;
        }
        res.json({status: 0, message: "Failed to delete item."});
    });
}