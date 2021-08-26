const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongo = require('./mongo')

mongo.db.createNewCollection('Users')
mongo.db.createNewCollection('Admin')

const app = express();

app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000* 60 * 60 *24 * 365 
    },
    secret: '1232abbc1a23123f123e123a'
}));

app.use(express.json());


app.post('/login', (req,res,next) => {

    async function login(){
        let cred = { email: req.body.email, password: req.body.password };
        let user = await mongo.db.loginUser(cred)
        if (user){
            req.session.user = cred;
            console.log(req.session)
            res.json(true)
        } else {
            res.json('Invalid credentials')
        }
    }
    login()
})

app.post('/signup', (req,res,next) => {
    async function signup(){
        let cred = { email: req.body.email, username:req.body.username, password: req.body.password };
        if (await mongo.db.registerUser(cred)){
            req.session.user = cred;
            console.log(req.session)
            res.json(true)
        } else {
            res.json('Invalid credentials') 
        }
    }
    if (req.body.password === req.body.password2){
       signup() 
    } else {
        res.json("Passwords don't match") 
    }
})

app.get('/logout', (req,res,next) => {
    req.session.destroy(()=>{
        res.json('logged out')
    })
})

app.get('/api', (req,res,next) => {
    console.log(req.session)
    if(req.session.user){
        res.json(true)
    } else {
        res.json('not logged in')
    }
})


app.listen(3001);