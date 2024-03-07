require('dotenv').config({ path: './.env' })
const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')

const Database = require('./database/mongodb')
const db = new Database()
const app = express()
const port = process.env.PORT || 3000

// setup databases
db.setDB()

// middlewares
app.use(express.json())
app.use(cookieParser(process.env.JSONWEBTOKEN_SECRET));
app.use(cors({ origin: '*' }))

// Get requests
app.get('/', (req, res) => res.send('OK'))

// Post requests
app.post('/addTask', require('./routes/addTask'))
app.post('/task', require('./routes/getTask'))
app.post('/register', require('./routes/register'))
app.post('/login', require('./routes/login'))

// Patch requests
app.patch('/updateTask', require('./routes/updateTask'))

app.listen(port, () => console.log(` Server running on port : ${port}!`))