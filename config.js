// config.

const dotenv = require('dotenv')
const path = require('path')
dotenv.config({
  path: path.resolve(__dirname, process.env.NODE_ENV.slice(0, -1) + '.env'),
})
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 8080,
  DB: process.env.DB_CONNECTION || 'mongodb://localhost:27017/Pos',
}
