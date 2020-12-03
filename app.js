const express = require('express')
const bodyParser = require('body-parser')

//setting routes
const ledgers = require('./routes/ledger')

const app = express()

// setting mongoose connection

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)

app.use(bodyParser.json())

//routes
app.use('/ledger', ledgers)

app.get('/', (req, res) => {
  res.send('Hello Welcome to :Different ledgers')
})

app.listen(8080, 'localhost', function () {
  console.log(`Server Started`)
})

module.exports = app
