const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const cron = require('node-cron');
const getUsersFromOurDB = require('../modules/update.invoices')

console.log('in report router');

getUsersFromOurDB();
// Execute the code block once every minute
// cron.schedule('* * * * *', function () {
//     console.log('NODE-CRONNING!!');
//     getUsersFromOurDB();
// });


module.exports = router;
