const pool = require('./pool');

function insertIntoOnetime_Donations (charge, res) {
    const sqlText = `INSERT INTO onetime_donations (
        amount_charged,
        product_id,
        charge_id,
        transaction_id,
        captured,
        date,
        user_id,
        nonprofit_id
    )
    VALUES (
        $1, $2, $3, $4, $5, $6, 
        (SELECT id FROM users WHERE customer_id=$7), 
        (SELECT id FROM nonprofit WHERE product_id=$8)
    );`;
    pool.query(sqlText, [
        charge.amount, 
        charge.metadata.product_id,
        charge.id,
        charge.balance_transaction,
        charge.captured,
        new Date(charge.created * 1000),
        charge.customer,
        charge.metadata.product_id
    ])
    .then(response => {
        res.sendStatus(200);
    })
    .catch(err => {
        console.log('ERROR on INSERT INTO onetime_donations:', err);
        res.sendStatus(500);
    });
}

module.exports = insertIntoOnetime_Donations;