const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require('./CRUD.js');

const url = "mongodb://localhost:27017/";

function registerUser(cred) {
    MongoClient.connect(url, function(err, db) {
        if (err) console.log(err);
        let dbo = db.db("UserDB");
        dbo.collection("Users").insertOne(cred, function(err, res) {
            if (err) console.log(err);
            console.log("User Registered");
            db.close();
        });
     }); 
 }

 function loginUser(cred) {
    MongoClient.connect(url, function(err, db) {
        if (err) console.log(err);
        let dbo = db.db("UserDB");
        dbo.collection("Users").findOne(cred, function(err, result) {
            if (err) console.log(err);
            db.close();
        });
     });
 }

const app = express();

app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    secret: '1232abbc1a23123f123e123a'
}));

app.use(express.json());

// app.use(basicAuth({
//     authorizer: (username, password) => {
//         const userMatches = basicAuth.safeCompare(username, 'admin')
//         const passwordMatches = basicAuth.safeCompare(password, 'supersecret')
//         return userMatches & passwordMatches
//     },
//     unauthorizedResponse: (req) => {
//         return `unauthorized. ip: ${req.ip}`
//     }
// }))

app.post('/login', (req,res,next) => {

    let cred = { email: req.body.email, password: req.body.password };
    loginUser(cred)

    req.session.user = cred;
    console.log(req.session)
    res.json('logged in')


    // db.crud.inMemoryDatabase.filter(user => {
    //     const userMatches = basicAuth.safeCompare(req.body.email, user.email)
    //     const passwordMatches = basicAuth.safeCompare(req.body.password, user.password)
    //     if (userMatches && passwordMatches){
    //         req.session.user = user;
    //         console.log(req.session)
    //         res.json('logged in')
    //     }
    // })
})

app.post('/signup', (req,res,next) => {
    let cred = { email: req.body.email, username:req.body.username, password: req.body.password };
    registerUser(cred)
    req.session.user = cred;
    console.log(req.session)
    res.json('signup successful')
    
    

    // let match = db.crud.inMemoryDatabase.find(user => {
    //     const userMatches = basicAuth.safeCompare(req.body.email, user.email)
    //     if (userMatches){
    //         return true
    //     }
    // })
    // if (match){
    //     res.json('Username already in use')
    // } else {
    //     const create = db.crud.Create(req.body.email,req.body.password)
    //     let recordData = {username: req.body.username}
    //     const update = db.crud.Update(req.body.email,recordData)
    //     console.log(create,update);
    //     if (create && update) {
    //         db.crud.flushDB()
    //         req.session.user = {email:req.body.email};
    //         console.log(req.session)
    //         res.json('signup successful')
    //     } else {
    //         res.json('signup failed')
    //     }
    // }
})


app.get('/api', (req,res,next) => {
    console.log(req.session)
    if(req.session.user){
        res.json(req.session.user.email)
    } else {
        res.json('not logged in')
    }
})


app.listen(3001);