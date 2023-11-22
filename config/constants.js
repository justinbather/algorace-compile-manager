require('dotenv').config()

const PORT = process.env.PORT || 7070;
const CLIENT_URL = process.env.CLIENT_URL || 'localhost:3000'
const WORKER_URL = process.env.WORKER_URL || 'localhost:5050'

module.exports = { PORT, CLIENT_URL, WORKER_URL }
