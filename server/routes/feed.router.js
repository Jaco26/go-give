const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();

console.log('in feed router');

router.post('/', (request, response)=>{
    console.log('in post new feed item', request.body);
    pool.query(`INSERT INTO feed (nonprofit_id, title, feed_text, feed_img_url, feed_video_url, feed_date_posted) VALUES ($1, $2, $3, $4, $5, $6);`,
                [request.body.id, request.body.title, request.body.feed_text, request.body.feed_img, request.body.feed_video, request.body.feed_date])
                .then((result) => {
                    console.log('registered new feed');
                    response.sendStatus(201);
                })
                .catch((err) => {
                    console.log('error in feed' , err);
                    response.sendStatus(500);
                })
})
//end post feed item

router.get('/', (request, response) => {
  console.log('in get all feed items');
  pool.query(`SELECT nonprofit.name, feed.title, feed.feed_text, feed.feed_img_url, feed.feed_video_url, feed.feed_date_posted FROM feed
              JOIN nonprofit ON nonprofit.id = feed.nonprofit_id
              ORDER by feed_date_posted DESC;`)
  .then((result) => {
    console.log('success in get all feeds', result);
    response.send(result)
  })
  .catch((err) => {
    console.log('error in get all feeds', err);
    response.sendStatus(500);
  })
})
//end get all feed items

module.exports = router;
