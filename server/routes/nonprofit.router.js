const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();

console.log('in nonprofit router');

router.post('/', (request, response) => {
    console.log('in post new nonprofit -- route', request.body);
    pool.query('INSERT INTO nonprofit (name, picture_url, logo_url, description, goal_value, goal_description) VALUES ($1, $2, $3, $4, $5, $6);',
                [request.body.name, request.body.picture_url, request.body.logo_url, request.body.description, request.body.goal, request.body.goal_description])
                .then((result) => {
                    console.log('registered new nonprofit');
                    response.sendStatus(201);
                })
                .catch((err) => {
                    console.log('error in nonprofit post', err);
                    response.sendStatus(500);
                })
})
//end POST new nonprofit

router.get('/', (request, response) => {
  pool.query('SELECT * FROM nonprofit ORDER BY name')
  .then((result) => {
    console.log('success in get all nonprofits', result);
    response.send(result)
  })
  .catch((err) => {
    console.log('error in get all nonprofits', err);
    response.sendStatus(500);
  })
})
//end get all nonprofits


module.exports = router;
