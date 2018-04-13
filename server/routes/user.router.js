const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
// const user = require('../public/scripts/services/user.service.js')

console.log('in user router');


router.post('/', (request, response) => {
  console.log('in POST fb', request.body);
  pool.query('INSERT INTO users (name, img_url, fb_id, first_name, last_name) VALUES ($1, $2, $3, $4, $5);',
              [request.body.name, request.body.url, request.body.fbid, request.body.first_name, request.body.last_name])
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

  router.get('/', (request, response)=>{
    console.log('in get all users route');
    pool.query('SELECT * FROM users ORDER BY last_name;')
    .then((result)=>{
      console.log('success in get', result);
      response.send(result);
    })
    .catch((err) => {
      response.sendStatus(500);
    })
  })
// end get all users route

  router.delete('/:id', (request, response) => {
    console.log('in delete user route', request.params.id);
    pool.query('DELETE FROM users WHERE id = $1;', [request.params.id])
    .then((result) => {
      console.log('success in deleting user', result);
      response.sendStatus(200);
    })
    .catch((err) => {
      console.log('error in delete user', err);
      response.sendStatus(500);
    })
  })




module.exports = router;
