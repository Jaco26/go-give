const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();

console.log('in feed router');

router.post('/', (request, response)=>{
  if (request.isAuthenticated()){
    console.log('in post new feed item', request.body);
    pool.query(`INSERT INTO feed (nonprofit_id, title, feed_text, feed_img_url, feed_video_url) VALUES ($1, $2, $3, $4, $5);`,
                [request.body.id, request.body.title, request.body.feed_text, request.body.feed_img, request.body.feed_video])
                .then((result) => {
                    console.log('registered new feed');
                    response.sendStatus(201);
                })
                .catch((err) => {
                    console.log('error in feed' , err);
                    response.sendStatus(500);
                })
    } else {
      response.sendStatus(403);
    }
})
//end post feed item

router.get('/', (request, response) => {
  console.log('in get all feed items');
  if (request.isAuthenticated()){
    pool.query(`SELECT nonprofit.name, nonprofit.logo_url, feed.title, feed.feed_text, feed.feed_img_url, feed.feed_video_url, feed.feed_date_posted, feed.id, feed.nonprofit_id FROM feed
                JOIN nonprofit ON nonprofit.id = feed.nonprofit_id
                ORDER by feed_date_posted DESC;`)
    .then((result) => {
      console.log('success in get all feeds', result.rows);
      response.send(result)
    })
    .catch((err) => {
      console.log('error in get all feeds', err);
      response.sendStatus(500);
    })
  } else{
    response.sendStatus(403);
  }
})//end get all feed items



router.delete('/:id', (request, response) => {
  console.log('in delete router', request.params.id);
  if (request.isAuthenticated()){
    pool.query(`DELETE FROM feed WHERE id = $1;`,[request.params.id])
    .then((result) => {
      console.log('success in delete', result);
      response.sendStatus(201);
    })
    .catch((err) => {
      console.log('error in delete', err);
      response.sendStatus(500);
    })
  } else {
    response.sendStatus(403);
  }
})
// end delete feed items

router.get('/:id', (request , response) => {
  if (request.isAuthenticated()){
    pool.query(`SELECT nonprofit.name, feed.title, feed.feed_text, feed.feed_img_url, feed.feed_video_url, feed.feed_date_posted, feed.id FROM feed
    JOIN nonprofit ON nonprofit.id = feed.nonprofit_id
    WHERE feed.id = $1;`, [request.params.id])
    .then((result) => {
      console.log('success in get for edit', result);

      response.send(result)
    })
    .catch((err) => {
      console.log('error in get for edit', err);

      response.sendStatus(500)
    })
  } else {
    response.sendStatus(403);
  }
})
// end get for update


router.put('/', (request, response) => {
  if (request.isAuthenticated()){
    console.log('in update router', request.body);
    pool.query(`UPDATE feed SET title = $1, feed_text = $2, feed_img_url = $3, feed_video_url = $4
                 WHERE feed.id = $5;`, [request.body.title, request.body.feed_text, request.body.feed_img, request.body.feed_video, request.body.id])
    .then((result) => {
      console.log('success in update', result);
      response.sendStatus(201);

    })
    .catch((err) => {
      console.log('error in update', err);
      response.sendStatus(500);
    })
  } else{
    response.sendStatus(403);
  }
})



module.exports = router;
