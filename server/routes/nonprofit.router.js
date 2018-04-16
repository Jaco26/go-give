const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();
const userData= require('../modules/userData.js');

console.log('in nonprofit router');

router.post('/', (request, response) => {
    console.log('in post new nonprofit -- route', request.body);
    user = userData(request.body.user.fbid)
    .then(function(user){
      if(user.role == 1){
    pool.query('INSERT INTO nonprofit (name, picture_url, logo_url, description, goal_value, goal_description) VALUES ($1, $2, $3, $4, $5, $6);',
        [request.body.newNonprofit.name, request.body.newNonprofit.picture_url,
        request.body.newNonprofit.logo_url, request.body.newNonprofit.description, request.body.newNonprofit.goal, request.body.newNonprofit.goal_description])
        .then((result) => {
            console.log('registered new nonprofit');
            response.sendStatus(201);
        })
        .catch((err) => {
            console.log('error in nonprofit post', err);
            response.sendStatus(500);
        })
      } else {
        response.sendStatus(500);
        console.log('error, must be admin');
      }
    })
 })
//end POST new nonprofit, protected

router.get('/', (request, response) => {
  pool.query('SELECT * FROM nonprofit ORDER BY name')
  .then((result) => {
    console.log('success in get all nonprofits', result.rows);
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
    console.log('success in get populateEdit', result);
    response.send(result)
  })
  .catch((err) => {
    console.log('error in get editpopulate', err);
    response.sendStatus(500);
  })
})
//end get populate edit

router.delete('/:id/:user', (request, response) => {
  console.log('in delete nonprofit route', request.params.id, request.params.user);
  user = userData(request.params.user)
   .then(function(user){
     if(user.role == 1){
       pool.query('DELETE FROM nonprofit WHERE id = $1;', [request.params.id])
       .then((result) => {
         console.log('success in delete nonprofit', result);
         response.sendStatus(200);
       })
       .catch((err) => {
         console.log('error in delete nonprofit', err);
         response.sendStatus(500);
       })

     } else{
       response.sendStatus(500);
       console.log('error, must be admin');
     }
   })
})
//end delete nonprofit, protected

router.put('/', (request, response) => {
  console.log('in edit nonprofit route', request.body);
  user = userData(request.body.user.fbid)
   .then(function(user){
     if(user.role == 1){
      pool.query('UPDATE nonprofit SET name = $1, picture_url = $2, logo_url = $3, description = $4, goal_value = $5, goal_description = $6 WHERE id = $7;',
        [request.body.editedNonprofit.name, request.body.editedNonprofit.picture_url, request.body.editedNonprofit.logo_url, request.body.editedNonprofit.description, request.body.editedNonprofit.goal, request.body.editedNonprofit.goal_description, request.body.editedNonprofit.id])
        .then((result) => {
          console.log('success in edit nonprofit', result);
          response.sendStatus(200);
        })
        .catch((err) => {
          console.log('error in edit nonprofit', err);
          response.sendStatus(500);
        })
      } else {
        response.sendStatus(500);
        console.log('error, must be admin');
      }
  })
})
//end edit nonprofit, protected

module.exports = router;
