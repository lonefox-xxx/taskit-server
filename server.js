require('dotenv').config({ path: './.env' })
require('./database/redis');
require('./bot/bot');
const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')

const Database = require('./database/mongodb');
const AdminAuth = require('./helper/auth');
const ReferralProgramAuth = require('./helper/referralProgramAuth');
const mongoDb = new Database()
const app = express()
const port = process.env.SERVER_PORT || 3000
// const port = 3000

// setup databases
mongoDb.setDB()

// middlewares
app.use(express.json())
app.use(cors({ origin: '*' }));
app.use(cookieParser());

// Get requests
app.get('/', (req, res) => res.send('everything fine'))
app.get('/getTasks', AdminAuth, require('./routes/getTasks'))
app.get('/getImpressions', AdminAuth, require('./routes/getImpressions'))
app.get('/getPaymentCards', ReferralProgramAuth, require('./routes/getPaymentCard'))
app.get('/getReferralProgramLinks', ReferralProgramAuth, require('./routes/getReferralProgramLinks'))
app.get('/getReferralProgramTransactions', ReferralProgramAuth, require('./routes/getReferralProgramTransactions'))
app.get('/getReferralProgramChannelsAndGroups', ReferralProgramAuth, require('./routes/getReferralProgramChannelsAndGroups'))

// Post requests
app.post('/login', require('./routes/login'))
app.post('/task', require('./routes/getTask'))
app.post('/register', require('./routes/register'))
app.post('/addTask', AdminAuth, require('./routes/addTask'))
app.post('/publishTask', AdminAuth, require('./routes/publishTask'))
app.post('/referralProgramLogin', require('./routes/referralProgramLogin'))
app.post('/referralProgramRegister', require('./routes/referralProgramRegister'))
app.post('/addPaymentCard', ReferralProgramAuth, require('./routes/addPaymentCard'))
app.post('/generateChannelOrGroupToken', require('./routes/generateChannelOrGroupToken'))
app.post('/addPartnerShipChannels', ReferralProgramAuth, require('./routes/addPaymentCard'))
app.post('/telegram-webhook', (req, res) => { bot.handleUpdate(req.body); res.sendStatus(200) });
app.post('/addChannelOrGroupToken', ReferralProgramAuth, require('./routes/addChannelOrGroupToken'))

// Patch requests
app.patch('/updateTask', AdminAuth, require('./routes/updateTask'))
app.patch('/updateUserPermissions', AdminAuth, require('./routes/updateUserPermissions'))

// delete requests
app.delete('/deletePaymentCard', ReferralProgramAuth, require('./routes/deletePaymentCard'))

// start server
app.listen(port, () => console.log(`Server running on port : ${port}!`))