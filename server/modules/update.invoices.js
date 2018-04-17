const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('./pool');

// console.log('IN UPDATE INVOICES MODULE!');

// getUsersFromOurDB();

function getUsersFromOurDB () {
    const sqlText = `SELECT * FROM users ORDER BY id;`;
    pool.query(sqlText, [])
    .then(response => {
        console.log('RESPONSE ------ ', response);
        
        response.rows.forEach(user => getStripeCustomerInfoFor(user));
    }).catch(err => {
        console.log(err);
    });
}

function getStripeCustomerInfoFor (user) {
    stripe.customers.retrieve(user.customer_id, 
        (err, customer) => {
            if(err){
                console.log(err);
            } else {
                customer.subscriptions.data.forEach(subscription => getInvoicesFor(subscription));
            }
        });
} 

function getInvoicesFor (subscription) {
    stripe.invoices.list({
        subscription: subscription.id
    },
    (err, invoices) => {
        if(err) {
            console.log(err);            
        } else {
            getInvoicesFromDBAndCheckAgainstThese(invoices.data)
        }
    })
}

function getInvoicesFromDBAndCheckAgainstThese (invoices) {
    const sqlText = `SELECT * FROM invoices;`;
    pool.query(sqlText, [])
    .then(response => {
        let invoicesInOurDB = response.rows;
        if(invoicesInOurDB.length > 0){
            invoicesInOurDB.forEach(ours  => {
                invoices.forEach(stripes => {
                    if (ours.invoice_id != stripes.id) {
                        insertIntoOurDB(stripes);
                    } else if (ours.invoice_id == stripes.id) {
                        updateOurDBWith(stripes);
                    }
                });
            });
        } else {
            invoices.forEach(invoice => insertIntoOurDB(invoice));
        }  
    })
    .catch(err => {
        console.log(err);
    });
}

function updateOurDBWith (invoice) {
    const sqlText = `UPDATE invoices SET 
            amount_paid=$1,
            date_saved=$2 
        WHERE invoice_id=$3;`;
    pool.query(sqlText, [invoice.amount_paid, new Date(), invoice.id])
    .then(response => {
        console.log('SUCCESS on UPDATE invoices');
    })
    .catch(err => {
        console.log('ERROR on UPDATE invoices');        
    });
}

function insertIntoOurDB (invoice) {
    const sqlText = `INSERT INTO invoices (
                amount_paid,
                invoice_id,
                product_id,
                charge_id,
                subscription_id,
                plan_id,
                period_start,
                period_end,
                date_saved,
                user_id,
                nonprofit_id
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                (SELECT id FROM users WHERE customer_id=$10),
                (SELECT id FROM nonprofit WHERE product_id=$11)
            );`;
    pool.query(sqlText, [
        invoice.amount_paid,
        invoice.id,
        invoice.lines.data[0].plan.product,
        invoice.charge,
        invoice.subscription,
        invoice.lines.data[0].plan.id,
        new Date(invoice.lines.data[0].period.start * 1000),
        new Date(invoice.lines.data[0].period.end * 1000),
        new Date(),
        invoice.customer,
        invoice.lines.data[0].plan.product
    ])
    .then(response => {
        console.log('SUCCESS on INSERT INTO invoices');
    })
    .catch(err => {
        console.log('ERROR on INSERT INTO invoices', err);
    });
}

module.exports = getUsersFromOurDB;