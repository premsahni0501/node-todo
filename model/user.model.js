const bcrypt = require("bcryptjs");

let mongoose, userSchema, UserModel;

module.exports = (mongooseRef) => {
    mongoose = mongooseRef;
    userSchema = new mongoose.Schema({
        name: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });
    UserModel = mongoose.model("User", userSchema);
}
module.exports.getUserByEmail = (userData, callback) => {
    UserModel.findOne(userData, callback);
}
module.exports.findUserById = (userData, callback) => {
    UserModel.findOne(userData, callback);
}
module.exports.comparePassword = (comparePassword, hash, callback) => {
    bcrypt.compare(comparePassword, hash, callback);
}
module.exports.addUser = (user, callback) => {
    const newUser = new UserModel({
        name: user.name,
        email: user.email,
        password: user.password,
        username: user.username
    })
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) 
                throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}