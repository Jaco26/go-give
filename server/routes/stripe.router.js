const express = require('express');
const pool = require('../modules/pool.js');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

console.log('in stripe router', process.env.STRIPE_SECRET_KEY);

// Get all transactions on Whyatt's account
router.get('/all-transactions', (req, res) => {
    stripe.balance.listTransactions( (err, transactions) => {
        if(err){
            console.log(err);
            res.sendStatus(500);
        } else {
            res.send(transactions)
        }
    })
})

// find a stripe.charge by id
router.get('/all-charges', (req, res) => {
    // const thatCharge = 'ch_1CDl88FewByiHSs3cyMAUBxP';
    stripe.charges.list( (err, charges) => {
        if(err){
            console.log(err);
            res.sendStatus(500)
        } else {
            res.send(charges)
        }
    });
});

//list all invoices
router.get('/all-invoices', (req, res) => {
    stripe.invoices.list( (err, invoices) => {
        if (err) {
            console.log(err);
            res.sendStatus(500)
        } else {
            res.send(invoices)
        }
    });
});

// list all orders
router.get('/all-orders', (req, res) => {
    stripe.orders.list( (err, orders) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);            
        } else {
            res.send(orders); 
        }
    });
});


// Send new customer email and source (encripted card token) 
// information to stripe. Then save some important bits from 
// the response––a customer object––in our database
router.post('/register', function (req, res) {
    console.log('req.body ----- - -- ----- ', req.body);
    let source = req.body.stripeSource;
    let email = req.body.email;
    let name = req.body.name;
    let userId = req.body.userId;
    stripe.customers.create(
        { email: email, source: source },
        (err, customer) => {
            if (err) {
                console.log(`ERROR on stripe.customers.create with email: ${email}`, err);
                res.sendStatus(500)
            } else {
                console.log('customer ++++ + ++ ++', customer);
                const sqlText = `UPDATE users SET customer_id=$1 WHERE id=$2`;
                pool.query(sqlText, [customer.id, userId])
                .then(response => {
                    res.sendStatus(201);
                }).catch(err => {
                    console.log('ERROR on INSERT INTO users', err);
                    res.sendStatus(500);
                })
            }
        });
});



// Create subscription
router.post('/subscribe_to_plan', (req, res) => {
    console.log('customer id -----------', req.body.customerId);
    console.log('plan id ---------------', req.body.planId);
    stripe.subscriptions.create({
        customer: req.body.customerId,
        items: [
            {
                plan: req.body.planId,
            }
        ]
    }, (err, subscription) => {
        if(err){
            console.log(err);
            res.sendStatus(500);
        } else {
            res.send(subscription);
        }
    })
})

let nonprofit = {};

function postNonprofit(nonprofit){
    console.log(nonprofit);
    const sqlText = `INSERT INTO nonprofit (name, city, state, description, product_id, plan_id_five, plan_id_ten, plan_id_twenty, created)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;
    pool.query(sqlText, [nonprofit.name, nonprofit.city, nonprofit.state, nonprofit.description, nonprofit.product_id, nonprofit.plan_id_five, nonprofit.plan_id_ten, nonprofit.plan_id_twenty, new Date()])
    .then(response => {
        console.log(response);
    }).catch(err => {
        console.log('ERROR on INSERT INTO users', err);
    })        
}

 // find a stripe.customer by id
router.get('/customer/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    stripe.customers.retrieve(customerId, (err, customer) => {
        if(err){
            console.log('ERROR on getting customer ' + customerId + ' from stripe ----- ', err);
            res.sendStatus(500);
        } else {
            res.send(customer)
        }
    });
});


router.post('/oneTimeDonate', (req, res) => {
    let donation = req.body;
    stripe.charges.create({
        amount: Number(donation.amount) * 100,
        currency: 'usd',
        customer: donation.customer,
        metadata: {product_id: donation.product}
    }, (err, plan) => {
        if(err){
            res.sendStatus(500);
            console.log(err);
        } else {
            res.sendStatus(200);
        } 
    });
})

router.post('/updateCard', (req, res) => {
    let customer = req.body;
    stripe.customers.update(customer.id, {
        source: customer.source,
      }, (err, source) => {
        if(err){
            res.sendStatus(500);
            console.log(err);
        } else {
            res.sendStatus(200);
        } 
    });

});

router.post('/updateEmail', (req, res) => {
    let customer = req.body;
    stripe.customers.update(customer.id, {
        email: customer.email,
      }, (err, customer) => {
        if(err){
            res.sendStatus(500);
            console.log(err);
        } else {
            res.sendStatus(200);
        } 
    });
});

router.post('/unsubscribe', (req, res) => {
    let subscription_id = req.body.id;
    stripe.subscriptions.del(subscription_id);
    res.sendStatus(200);
});

module.exports = router;
