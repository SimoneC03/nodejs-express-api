const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const messagesRouter = express.Router()
const Message = require('../schemas/message')
const Auth = require('../auth/functions')

/**@findAll -OR- @index */
messagesRouter.get('/', async (req, res) => {
    res.send(await Message.find().populate('author').exec())
})

/**@create */
messagesRouter.post('/', async (req, res) => {
    const decodedToken = Auth.validateToken(req.body.token)
    if(decodedToken) {
        res.send(await new Message({
            author: decodedToken.data.id,
            text: req.body.text
        }).save())
    }
    else {
        res.send({message:"Unauthenticated", error: true})
    }
})


module.exports = messagesRouter