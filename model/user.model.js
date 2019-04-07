const bcrypt = require("bcryptjs");

let mongoose, userSchema;

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
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });
    mongoose.model("User", userSchema);
}

module.exports.login = (userData, callback) => {
    // bcrypt.genSalt(10, (err, salt)=>{
    //     bcrypt.hash(userData.password, salt, (err, hash)=>{
    //         if(err) 
    //             throw err;
    //         userData.password = hash;
    //         console.log(userData);
    //         userData.save(callback);
    //     })
    // })
}
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) 
                throw err;
            newUser.password = hash;
            console.log(newUser);
            newUser.save(callback);
        })
    })
}