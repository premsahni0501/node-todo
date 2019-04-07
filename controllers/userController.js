const userModel = require("../model/user.model");

module.exports = (app, bodyParser)=>{
    app.get("/auth", (req, res)=>{
        res.render("auth")
    })
    app.post("/auth", bodyParser.urlencoded, (req, res)=>{
        console.log(req.body);

    })
    app.get("/register", bodyParser.urlencoded, (req, res)=>{
        const newUser = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        })
        userModel.addUser(newUser, (err, data)=>{
            if(err){
                res.render("register", {errors: err, success: null});
            }
            res.render("register", {errors: null, success: data});
        })
    })
}