const bcrypt = require("bcryptjs");
let todoSchema, TodoModel, mongoose;

module.exports = (mongooseRef) => {
    mongoose = mongooseRef;
    todoSchema = new mongoose.Schema({
        item: String,
        userId: String
    });
    TodoModel = mongoose.model("Todo", todoSchema);
}

module.exports.findAllTodos = (data, callback) =>{
    TodoModel.find(data, callback);
}
module.exports.saveTodo = (data, callback) =>{
    TodoModel(data).save((callback))
}
module.exports.updateTodo = (condition, data, callback) => {
    TodoModel.where(condition).updateOne(data, callback);
}
module.exports.deleteTodo = (condition, callback) => {
    TodoModel.find(condition).deleteOne(callback);
}