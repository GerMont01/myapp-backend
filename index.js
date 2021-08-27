const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongo = require('./mongo')

mongo.db.createNewCollection('Users')
mongo.db.createNewCollection('Admin')
mongo.db.createNewCollection('Reservations')

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
            req.session.user = user;
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
        let cred = { email: req.body.email, firstname:req.body.firstname, lastname:req.body.lastname, password: req.body.password };
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

let emailForPasswordChange = undefined;

app.post('/forgotpassword', (req,res,next) => {

    async function findEmail(){
        let cred = { email: req.body.email };
        user = await mongo.db.loginUser(cred)
        if (user){
            if (req.body.code === 'CODE') {
                emailForPasswordChange = user.email;
               res.json(true) 
            } else {
                res.json('Invalid code')
            }
            
        } else {
            res.json('User not found')
        }
    }
    findEmail()
})

app.post('/changepassword', (req,res,next) => {

    async function changePassword(){
        let cred = { email: emailForPasswordChange };
        if (await mongo.db.updateUser(cred, { password:req.body.password })){
            emailForPasswordChange = undefined;
            res.json(true) 
        } else {
            emailForPasswordChange = undefined;
            res.json('password could not be changed')
        }
    }
    if (req.body.password === req.body.password2){
        changePassword() 
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

app.post('/reserve', (req,res,next) => {
    async function reserve(){
        let reservation = { 
            email:req.session.user.email,
            name:`${req.session.user.lastname}, ${req.session.user.firstname}`,
            numOfPeople: req.body.numOfPeople,
            time: req.body.time
        };
        if (await mongo.db.reserve(reservation)){
            res.json(reservation)
        } else {
            res.json(false) 
        }
    }
    reserve();
})

app.listen(3001);