const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('./pool');

function updateInvoicesTableInOurDB () {
    getUsersFromOurDB()
}

function getUsersFromOurDB () {
    const sqlText = `SELECT * FROM users ORDER BY id;`;
    pool.query(sqlText, [])
    .then(response => {
      console.log(response, 'response in getUsersFromOurDB');
        // console.log('RESPONSE ------ ', response);
        response.rows.forEach(user => {
          if(user.customer_id){
            getStripeCustomerInfoFor(user)
          }
        });
    }).catch(err => {
        console.log(err);
    });
}

function getStripeCustomerInfoFor (user) {
  console.log(user, '*******************user in getStripeCustomerInfoFor');
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

function getInvoicesFromDBAndCheckAgainstThese (stripeInvoices) {
    const sqlText = `SELECT * FROM invoices;`;
    pool.query(sqlText, [])
    .then(response => {
        if(response.rows[0]){
            let ourInvoiceIds = response.rows.map(invoice => invoice.invoice_id);
            // console.log('THIS IS WHAT ourInvoiceIds IS =+-+-+333:', ourInvoiceIds);
            stripeInvoices.forEach(stripeInvoice => {
                // console.log('THIS IS WHAT stripeInvoice IS::::::::::::', stripeInvoice);
                if(ourInvoiceIds.indexOf(stripeInvoice.id) != -1){
                    updateOurDBWith(stripeInvoice);
                } else {
                    insertIntoOurDB(stripeInvoice);
                }
            });
        } else {
            stripeInvoices.forEach(stripeInvoice => insertIntoOurDB(stripeInvoice));
        }
    })
    .catch(err => {
        console.log(err);
    });
}

function updateOurDBWith (invoice) {
    const sqlText = `UPDATE invoices SET
            amount_paid=$1,
            last_updated=$2
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
                date,
                period_start,
                period_end,
                last_updated,
                user_id,
                nonprofit_id
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
                (SELECT id FROM users WHERE customer_id=$11),
                (SELECT id FROM nonprofit WHERE product_id=$12)
            );`;
    pool.query(sqlText, [
        invoice.amount_paid,
        invoice.id,
        invoice.lines.data[0].plan.product,
        invoice.charge,
        invoice.subscription,
        invoice.lines.data[0].plan.id,
        new Date(invoice.date * 1000),
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

module.exports = updateInvoicesTableInOurDB;
