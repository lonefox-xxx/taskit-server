require('dotenv').config({ path: './.env' })
require('./database/redis');
const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')

const Database = require('./database/mongodb');
const Auth = require('./helper/auth');
const ReferralProgramAuth = require('./helper/referralProgramAuth');
const db = new Database()
const app = express()
// const port = process.env.PORT || 3000
const port = 3000

// setup databases
db.setDB()

// middlewares
app.use(express.json())
app.use(cors({ origin: '*' }));
app.use(cookieParser());

// Get requests
app.get('/', (req, res) => res.cookie('ok', 'ok').send('Hello World!'))
app.get('/getImpressions', Auth, require('./routes/getImpressions'))
app.get('/getTasks', Auth, require('./routes/getTasks'))
app.get('/getPaymentCards', ReferralProgramAuth, require('./routes/getPaymentCard'))

// Post requests
app.post('/addTask', Auth, require('./routes/addTask'))
app.post('/task', require('./routes/getTask'))
app.post('/register', require('./routes/register'))
app.post('/login', require('./routes/login'))
app.post('/referralProgramRegister', require('./routes/referralProgramRegister'))
app.post('/referralProgramLogin', require('./routes/referralProgramLogin'))
app.post('/publishTask', Auth, require('./routes/publishTask'))
app.post('/addPaymentCard', ReferralProgramAuth, require('./routes/addPaymentCard'))


// Patch requests
app.patch('/updateTask', Auth, require('./routes/updateTask'))
app.patch('/updateUserPermissions', Auth, require('./routes/updateUserPermissions'))

// delete requests
app.delete('/deletePaymentCard', ReferralProgramAuth, require('./routes/deletePaymentCard'))
app.listen(port, () => console.log(` Server running on port : ${port}!`))
