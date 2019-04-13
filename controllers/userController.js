const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const database = require("../config/database");

module.exports = (app, bodyParser)=>{
    app.get("/auth", (req, res)=>{
        if(req.session.userSessionId == '' || req.session.userSessionId == null){
            res.render("auth");
        }
        else{
            req.session.userSessionId = data._id;
            res.redirect(`/todo/${data._id}`);
        }
    })
    app.post("/auth", bodyParser.urlencoded, (req, res)=>{
        const email = req.body.email;
        const password = req.body.password;

        userModel.getUserByEmail({email:email}, (err, data)=>{
            if(err){
                res.render("auth", { status: 0, msg: err});
            }
            console.log(data)
            if(!data){
                res.render("auth", { status: 0, msg: "User not found"});
            }
            else{
                userModel.comparePassword(password, data.password, (err, isMatched)=>{
                    if(err){
                        res.render("auth", { status: 0, msg: err});
                    }
                    if(isMatched){
                        req.session.userSessionId = data._id;
                        res.redirect(`/todo/${data._id}`);
                    }
                    else{
                        res.render("auth", { msg: "Email and passwords don't match.", status: 0});
                    }
                })
            }
        })
    });
    app.get("/register", (req, res)=>{
        if(req.session.userSessionId == '' || req.session.userSessionId == null){
            res.render("register");
        }
        else{
            req.session.userSessionId = data._id;
            res.redirect(`/todo/${data._id}`);
        }
    })
    app.post("/register", bodyParser.urlencoded, (req, res)=>{
        console.log(req.body);
        userModel.addUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        }, (err, data)=>{
            console.log(data);
            if(err){
                res.render("register", {msg: err, status: 0});
            }
            else{
                req.session.userSessionId = data._id;
                res.redirect(`/todo/${data._id}`);
            }
        })
    })
    app.get("/logout", bodyParser.urlencoded, (req, res)=>{
        req.session.userSessionId = null;
        console.log(req.body);
        res.redirect("/auth");
    })
}