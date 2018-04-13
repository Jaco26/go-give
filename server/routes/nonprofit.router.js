const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const stripeCreateProduct = require('../modules/stripe.create.product.module.js')

console.log('in nonprofit router');

router.post('/', (request, response) => {
  console.log('in post new nonprofit -- route', request.body);
  stripeCreateProduct(request.body, response);
})
//end POST new nonprofit

router.get('/', (request, response) => {
  pool.query('SELECT * FROM nonprofit ORDER BY name')
  .then((result) => {
    // console.log('success in get all nonprofits', result);
    response.send(result)
  })
  .catch((err) => {
    console.log('error in get all nonprofits', err);
    response.sendStatus(500);
  })
})
//end get all nonprofits

router.get('/:id', (request, response) => {
  console.log('in populate edit --get', request.params.id);
  pool.query('SELECT * FROM nonprofit WHERE id = $1;', [request.params.id])
  .then((result) => {
    // console.log('success in get populateEdit', result);
    response.send(result)
  })
  .catch((err) => {
    console.log('error in get editpopulate', err);
    response.sendStatus(500);
  })
})
//end get populate edit

router.delete('/:id', (request, response) => {
  console.log('in delete nonprofit route', request.params.id);
  pool.query('DELETE FROM nonprofit WHERE id = $1;', [request.params.id])
  .then((result) => {
    // console.log('success in delete nonprofit', result);
    response.sendStatus(200);
  })
  .catch((err) => {
    console.log('error in delete nonprofit', err);
    response.sendStatus(500);
  })
})
//end delete nonprofit







router.put('/', (request, response) => {
  console.log('in edit nonprofit route', request.body);
  pool.query('UPDATE nonprofit SET name = $1, picture_url = $2, logo_url = $3, description = $4, goal_value = $5, goal_description = $6 WHERE id = $7;',
              [request.body.name, request.body.picture_url, request.body.logo_url, request.body.description, request.body.goal, request.body.goal_description, request.body.id])
              .then((result) => {
                console.log('success in edit nonprofit', result);
                response.sendStatus(200);
              })
              .catch((err) => {
                console.log('error in edit nonprofit', err);
                response.sendStatus(500);
              })
})

module.exports = router;
