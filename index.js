const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const port = process.env.API_PORT || 3000
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

//Routes
const usersRouter = require('./routes/users')
const messagesRouter = require('./routes/messages')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_CONNECTION);

  app.use('/users', usersRouter)
  app.use('/messages', messagesRouter)
  
  app.listen(port, () => {
    console.log(`API is listening at http://localhost:${port}`)
  })
}
