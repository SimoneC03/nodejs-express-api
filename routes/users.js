const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const usersRouter = express.Router()
const User = require('../schemas/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Auth = require('../auth/functions')
const Validate = require('../validation/functions')


/**@ADMIN_ROUTE */
/**@findAll -OR- @index */
usersRouter.post('/', async (req,res) => {
    const decodedToken = Auth.validateToken(req.body.token)
    if(decodedToken) {
        const user = await User.findOne({_id:decodedToken.data.id}).exec()
        if(user.role == 'admin') {
            if(req.body.admin_password == process.env.ADMIN_ROUTES_PASSWORD)
                res.send(await User.find().exec())
            else    
                res.send({message: "Unauthorized", error: true})
        }
        else {
            res.send({message: "Unauthorized", error: true})
        }
    }
    else {
        res.send({message:"Unauthenticated", error: true})
    }
})

/**@create -OR- @register */
usersRouter.post('/register', async (req, res) => {
    if(req.body.username == undefined)
        res.send({message: "Please insert a valid username", error: true})
    else if(req.body.email == undefined || !Validate.validateEmail(req.body.email))
        res.send({message: "Please insert a valid email address", error: true})
    else if(await User.findOne({username:req.body.username}).exec() != null)
        res.send({message: "This username has already been taken", error: true})
    else if(await User.findOne({email:req.body.email}).exec() != null)
        res.send({message: "This email has already been registered", error: true})
    else {
        try {
            res.send(await new User({
                firstName: (req.body.firstName != undefined) ? req.body.firstName : null,
                lastName: (req.body.lastName != undefined) ? req.body.lastName : null,
                email: req.body.email,
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, 10)
            }).save())
        }
        catch {
            res.send({message: "Error while creating new user", error: true})
        }
    }
})

/**@login */
usersRouter.post('/login', async (req, res) => {
    if(req.body.password == undefined || req.body.password == '')
        res.send({message: "Please insert your password", error: true})
    else if((req.body.username == undefined || req.body.password == '') && (req.body.email == undefined || req.body.email == ''))
        res.send({message: "Please insert a valid username or email", error: true})
    else if(req.body.username != undefined) {
        //Login with username
        const user = await User.findOne({username: req.body.username})
        if(user != null) {
            bcrypt.compare(req.body.password, user.password).then(function(result) {
                if(result === true) {
                    //Logged
                    const token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * parseInt(process.env.JWT_EXPIRY_IN_MINUTES)), data: {id: user._id, username: user.username}}, process.env.JWT_SECRET)
                    res.send(token)
                }
                else {
                    res.send({message: "Wrong password", error: true})
                }
            });
        }
        else {
            res.send({message: "User not found", error: true})
        }
    }
    else if(req.body.email != undefined) {
        if(Validate.validateEmail(req.body.email)) {
            const user = await User.findOne({email: req.body.email})
            if(user != null) {
                bcrypt.compare(req.body.password, user.password).then(function(result) {
                    if(result === true) {
                        //Logged
                        const token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 4), data: {id: user._id, username: user.username}}, process.env.JWT_SECRET)
                        res.send(token)
                    }
                    else {
                        res.send({message: "Wrong password", error: true})
                    }
                });
            }
            else {
                res.send({message: "User not found", error: true})
            }
        }
        else {
            res.send({message: "Please insert a valid email address", error: true})
        }
    }
})

/**@profile */
usersRouter.post('/profile', async (req, res) => {
    const decodedToken = Auth.validateToken(req.body.token)
    if(decodedToken) {
        res.send(await User.findOne({_id:decodedToken.data.id}).exec())
    }
    else {
        res.send({message:"Unauthenticated", error: true})
    }
})

module.exports = usersRouter
