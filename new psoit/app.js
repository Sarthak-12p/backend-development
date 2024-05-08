const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const userModel = require("./models/user")
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const postModel = require('./models/post')

app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(cookieParser())


app.get('/' , (req, res) =>{
    res.render("index")
})

app.get('/login' , (req, res) =>{
    res.render("login")
})


app.post('/register' , async (req ,res) =>{
    let {email , username ,age ,password , name } = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("Users Already Registered");

    bcrypt.genSalt(10 , (err ,salt)=>{
        bcrypt.hash(password ,salt , async(err , hash) =>{
            let user = await userModel.create({
                username,
                name,
                email,
                password:hash,
                age
            });
            
            let token = jwt.sign({email: email , userid: user._id} , "shhhhhhhhh")
            res.cookie("token" , token);
            res.send("registered")

        })


    })
})


app.post('/login' , async (req ,res) =>{
    let {email , password} = req.body;

    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("Something went wrong");

    bcrypt.compare(password, user.password , function(er, result){
        if(result) re.status(200).send("you can login ")
        
        else res.redirect("/login");
    })
   

 
})

app.listen(3000);