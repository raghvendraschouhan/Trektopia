const connecttomongo = require('./db')
const express = require('express')
var cors = require('cors')
connecttomongo()
const app = express()
app.use(cors())
const port = 5000
app.use(express.json())
//routes

app.use('/api/auth', require('./routes/auth'))

app.get('/', (req, res) => {
  res.send('Hello People')
})
app.listen(port, () => {
  console.log(`iNotebook Backend listening on port ${port}`)
})
