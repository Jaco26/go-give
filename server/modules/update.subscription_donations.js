const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('./pool');
const cron = require('node-cron');

// Execute the code block once every day
cron.schedule('* * *', function(){

});


function getUsersFromOurDB () {
    const sqlText = `SELECT * FROM users ORDER BY id;`;
    pool.query(sqlText, [])
    .then(response => {
        response.data.rows.forEach(user => getStripeCustomerInfoFor(user));
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
            invoices.data.forEach(invoice => insertIntoInvoices(invoice));
        }
    })
}

function insertIntoInvoices (invoice) {
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
        invoice.lines
    ])
}