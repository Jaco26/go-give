const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const cron = require('node-cron');
const updateInvoices = require('../modules/update.invoices');

console.log('in report router');

// updateInvoices();
// Execute the code block once every HOUR
cron.schedule('1 * * * *', function () {
    console.log('NODE-CRONNING!!', new Date().toLocaleTimeString());
    updateInvoices();
});


module.exports = router;
