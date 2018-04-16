const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const pool = require('./pool.js');

let nonprofit;

function createStripeProduct (request, response) {
    nonprofit = request;
    stripe.products.create({
        name: nonprofit.name,
        type: 'service'
    }, (err, product) => {
        if(err){
            console.log(err);
            res.sendStatus(500);  
        } else {
            nonprofit.product_id = product.id
            createFiveDollarPlan(nonprofit.product_id, response);
        } 
    });
}

function createFiveDollarPlan(id, response){
    stripe.plans.create({
        product: id,
        currency: 'usd',
        interval: 'day',
        nickname: '$5/day',
        amount: 500,
    }, (err, plan) => {
        if(err){
            console.log(err); 
        } else {
            nonprofit.plan_id_five = plan.id
            createTenDollarPlan(id, response);
        } 
    });
} //end createPlans

function createTenDollarPlan(id, response){
    stripe.plans.create({
        product: id,
        currency: 'usd',
        interval: 'day',
        nickname: '$10/day',
        amount: 1000,
    }, (err, plan) => {
        if(err){
            console.log(err);
        } else {
            nonprofit.plan_id_ten = plan.id
            createTwentyDollarPlan(id, response)
        } 
    });
}

function createTwentyDollarPlan(id, response){
    stripe.plans.create({
        product: id,
        currency: 'usd',
        interval: 'day',
        nickname: '$20/day',
        amount: 2000,
    }, (err, plan) => {
        if(err){
            console.log(err); 
        } else {
            nonprofit.plan_id_twenty = plan.id
            postNonprofit(nonprofit, response);
        } 
    });
}

function postNonprofit(nonprofit, response){
    pool.query('INSERT INTO nonprofit (name, city, state, picture_url, logo_url, description, goal_value, goal_description, product_id, plan_id_five, plan_id_ten, plan_id_twenty, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);',
                [nonprofit.name, nonprofit.city, nonprofit.state, nonprofit.picture_url, nonprofit.logo_url, nonprofit.description, nonprofit.goal_value, nonprofit.goal_description, nonprofit.product_id, nonprofit.plan_id_five, nonprofit.plan_id_ten, nonprofit.plan_id_twenty, new Date()])
                .then((result) => {
                    console.log('registered new nonprofit');
                    response.sendStatus(201);
                })
                .catch((err) => {
                    console.log('error in nonprofit post', err);
                    response.sendStatus(500);
                })
}

module.exports = createStripeProduct;