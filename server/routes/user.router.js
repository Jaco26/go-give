const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const getUsersDonationHistory = require('../modules/ourDB.user.donation.info');

router.get('/:id', (request, response) => {
  if (request.isAuthenticated()){
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
  } else {
    response.sendStatus(403);
  }
}) // end get FB user by id

router.get('/', (request, response)=>{
  if (request.isAuthenticated()){
    console.log('in get all users route');
    pool.query('SELECT * FROM users ORDER BY last_name;')
    .then((result)=>{
      console.log('success in get', result.rows);
      response.send(result);
    })
    .catch((err) => {
      response.sendStatus(500);
    })
  } else {
    response.sendStatus(403);
  }
}) // end get all users route

router.delete('/:id', (request, response) => {
  if (request.isAuthenticated()){
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
  } else {
    response.sendStatus(403);
  }
}) // end delete user

router.get('/donation-history/:userId', (req, res) => {
  let userId = req.params.userId
  getUsersDonationHistory(userId, res);
}); // end get donation history by user ID

module.exports = router;