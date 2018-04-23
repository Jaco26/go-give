const pool = require('./pool');

function updateSubscriptionStatus (subscription, res) {
    const sqlText = `UPDATE invoices SET subscription_status = $1 WHERE subscription_id = $2;`;
    pool.query(sqlText, [subscription.status, subscription.id])
        .then(response => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.log('ERROR on UPDATE invoices ******* ', err);
            res.sendStatus(500);            
        });
}

module.exports = updateSubscriptionStatus;