require('dotenv').config({ path: './.env' })
require('./database/redis');
require('./bot/bot');
require('./database/firebase')

const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const multer = require('multer');

const Database = require('./database/mongodb');
const AdminAuth = require('./helper/auth');
const ReferralProgramAuth = require('./helper/referralProgramAuth');
const mongoDb = new Database()
const app = express()
const port = process.env.SERVER_PORT || 3000

// setup databases
mongoDb.setDB()

// middlewares
app.use(express.json())
app.use(cors({ origin: '*' }));
app.use(cookieParser());

// Initialize Multer for file uploads
const uploadProofsFile = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB limit
    }
});

// Get requests
app.get('/task', require('./routes/getTask'))
app.get('/', (req, res) => res.send('everything fine'))
app.get('/getTaskSteps', require('./routes/getTaskSteps'))
app.get('/getTasks', AdminAuth, require('./routes/getTasks'))
app.get('/getRequiredProofs', require('./routes/getRequiredProofs'))
app.get('/getImpressions', AdminAuth, require('./routes/getImpressions'))
app.get('/getPaymentCards', ReferralProgramAuth, require('./routes/getPaymentCard'))
app.get('/getAllInviteLInks', ReferralProgramAuth, require('./routes/getAllInviteLInks'))
app.get('/getReferralProgramLinks', ReferralProgramAuth, require('./routes/getReferralProgramLinks'))
app.get('/getReferralProgramTransactions', ReferralProgramAuth, require('./routes/getReferralProgramTransactions'))
app.get('/getReferralProgramChannelsAndGroups', ReferralProgramAuth, require('./routes/getReferralProgramChannelsAndGroups'))

// Post requests
app.post('/login', require('./routes/login'))
app.post('/register', require('./routes/register'))
app.post('/submitProofs', require('./routes/submitProofs'))
app.post('/registerTask', require('./routes/registerTask'))
app.post('/addTask', AdminAuth, require('./routes/addTask'))
app.post('/publishTask', AdminAuth, require('./routes/publishTask'))
app.post('/referralProgramLogin', require('./routes/referralProgramLogin'))
app.post('/referralProgramRegister', require('./routes/referralProgramRegister'))
app.post('/addPaymentCard', ReferralProgramAuth, require('./routes/addPaymentCard'))
app.post('/generateChannelOrGroupToken', require('./routes/generateChannelOrGroupToken'))
app.post('/addPartnerShipChannels', ReferralProgramAuth, require('./routes/addPaymentCard'))
app.post('/telegram-webhook', (req, res) => { bot.handleUpdate(req.body); res.sendStatus(200) });
app.post('/uploadProofsFile', uploadProofsFile.single('file'), require('./routes/uploadProofsFile'));
app.post('/uploadExampleFile', uploadProofsFile.single('file'), require('./routes/uploadExampleFile'));

// Patch requests
app.patch('/connectTelegram', require('./routes/connectTelegram'))
app.patch('/updateTask', AdminAuth, require('./routes/updateTask'))
app.patch('/confirmTask', AdminAuth, require('./routes/confirmTask'))
app.patch('/turnOnChannelsAndGroups', require('./routes/turnOnChannelsAndGroups'))
app.patch('/turnOffChannelsAndGroups', require('./routes/turnOffChannelsAndGroups'))
app.patch('/updateUserPermissions', AdminAuth, require('./routes/updateUserPermissions'))
app.patch('/connectPaymentCardWithChannelOrGroup', ReferralProgramAuth, require('./routes/connectPaymentCardWithChannelOrGroup'))
app.patch('/updateChannelOrGroupStatus', ReferralProgramAuth, require('./routes/updateChannelOrGroupStatus'))
app.patch('/updatePaymentCard', ReferralProgramAuth, require('./routes/updatePaymentCard'))

// delete requests
app.delete('/deletePaymentCard', ReferralProgramAuth, require('./routes/deletePaymentCard'))
app.delete('/deleteChannelOrGroup', ReferralProgramAuth, require('./routes/deleteChannelOrGroup'))

app.listen(port, () => console.log(`Server running on port : ${port}!`))