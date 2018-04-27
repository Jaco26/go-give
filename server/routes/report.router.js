const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const cron = require('node-cron');
const updateInvoices = require('../modules/update.invoices');
// const axios = require('axios');

// Execute the code block once every HOUR
cron.schedule('50 * * * *', function () {
    console.log('NODE-CRONNING!!', new Date().toLocaleTimeString());
   
    // makeResToSend();
    updateInvoices();
});

function makeResToSend () {
    router.get('/', (req, res) => {
        updateInvoices(res)
    });
}


module.exports = router;
