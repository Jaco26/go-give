const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();

console.log('in user router');

router.post('/', (request, response) => {
  console.log('in POST fb', request.body);
  pool.query('INSERT INTO users (name, img_url, fb_id) VALUES ($1, $2, $3);',
              [request.body.name, request.body.url, request.body.fbid])
    .then((result) => {
      console.log('registered new user');
      response.sendStatus(201);
    })
    .catch((err) => {
      console.log('error in new user post', err);
      response.sendStatus(500);
    })
})
//end POST new user

  router.get('/:id', (request, response) => {
    console.log('in get check for register', request.params.id);
    pool.query('SELECT * FROM users WHERE fb_id = $1;', [request.params.id])
    .then((result) => {
      console.log('success in get', result);
      response.send(result);
    })
    .catch((err) => {
      console.log('error in get', err);
      response.sendStatus(500);
    })
  })
  //end get FB user by id


module.exports = router;
