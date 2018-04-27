const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const stripeCreateProduct = require('../modules/stripe.create.product.module.js')
const getSummaryOfDonationsReveivedFor = require('../modules/ourDB.nonprofit.donation.info');
const getTopDonors = require('../modules/ourDB.top.donors');

// GET DONATION HISTORY BY NONPROFIT ID
router.get('/donation-history/:nonprofitIds', (req, res) => {
  let nonprofitIds = req.params.nonprofitIds;
  getSummaryOfDonationsReveivedFor(nonprofitIds, res);
});

// GET A LIST OF TOP DONORS for given nonprofit
router.get('/top-donors/:nonprofitId', (req, res) => {
  let nonprofitId = req.params.nonprofitId;
  getTopDonors(nonprofitId, res);
});

// POST NEW NONPROFIT
router.post('/', (request, response) => {
  if (request.isAuthenticated()){
    console.log('in post new nonprofit -- route', request.body);
    stripeCreateProduct(request.body, response);
  } else {
    response.sendStatus(403);
    }
})

// GET ALL NONPROFITS
router.get('/', (request, response) => {
  if (request.isAuthenticated()){
    pool.query('SELECT * FROM nonprofit ORDER BY name')
    .then((result) => {
      console.log('success in get all nonprofits', result.rows);
      response.send(result);
    })
    .catch((err) => {
      console.log('error in get all nonprofits', err);
      response.sendStatus(500);
})
} else {
  response.sendStatus(403);
  }
})

// POPULATE EDIT FIELDS FOR ADMIN
router.get('/:id', (request, response) => {
  if (request.isAuthenticated()){
    console.log('in populate edit --get', request.params.id);
    pool.query('SELECT * FROM nonprofit WHERE id = $1;', [request.params.id])
    .then((result) => {
      console.log('success in get populateEdit', result);
      response.send(result)
    })
    .catch((err) => {
      console.log('error in get editpopulate', err);
      response.sendStatus(500);
    })
  } else {
    response.sendStatus(403);
  }
})

// DELETE NONPROFIT
router.delete('/:id', (request, response) => {
  if (request.isAuthenticated()){
    console.log('in delete nonprofit route', request.params.id);
    pool.query('DELETE FROM nonprofit WHERE id = $1;', [request.params.id])
    .then((result) => {
      console.log('success in delete nonprofit', result);
      response.sendStatus(200);
    })
    .catch((err) => {
      console.log('error in delete nonprofit', err);
      response.sendStatus(500);
    })
  } else {
    response.sendStatus(403);
  }
})

// EDIT NONPROFIT
router.put('/', (request, response) => {
  if (request.isAuthenticated()){
    console.log('in edit nonprofit route', request.body);
    pool.query('UPDATE nonprofit SET name = $1, picture_url = $2, logo_url = $3, description = $4, goal_value = $5, goal_description = $6 WHERE id = $7;',
                [request.body.name, request.body.picture_url, request.body.logo_url, request.body.description, request.body.goal_value, request.body.goal_description, request.body.id])
                .then((result) => {
                  console.log('success in edit nonprofit', result);
                  response.sendStatus(200);
                })
                .catch((err) => {
                  console.log('error in edit nonprofit', err);
                  response.sendStatus(500);
                })
  } else {
    response.sendStatus(403);
  }
});

module.exports = router;
