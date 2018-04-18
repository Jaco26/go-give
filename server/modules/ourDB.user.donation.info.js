const pool = require('./pool');

function getUsersDonationHistory (user_id, res) {
    getUsersOnetimeDonationHistory(user_id, res);
}


function getUsersOnetimeDonationHistory (user_id, res) {
    const sqlText = `SELECT otd.id, otd.amount_charged, np.name, np.logo_url, np.id 
    FROM onetime_donations as otd JOIN nonprofit as np ON otd.product_id = np.product_id
    WHERE user_id = $1;`;
    pool.query(sqlText, [user_id])
    .then(response => {
        let usersDonations = {userId: user_id, onetime: response.rows};
        getUsersSubscriptionInvoiceHistory(usersDonations, user_id, res);
    })
    .catch(err => {
        console.log(err); 
        res.sendStatus(500);
    });
}

function getUsersSubscriptionInvoiceHistory (usersDonations, user_id, res) {
    const sqlText = `SELECT sid.id, sid.amount_paid, np.name, np.logo_url, np.id 
    FROM invoices as sid JOIN nonprofit as np ON sid.product_id = np.product_id
    WHERE user_id = $1;`;
    pool.query(sqlText, [user_id])
    .then(response => {
        usersDonations = {...usersDonations, invoices: response.rows};
        res.send(usersDonations)
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });

}

module.exports = getUsersDonationHistory;