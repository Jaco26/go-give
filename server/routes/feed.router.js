const express = require('express');
const pool = require('../modules/pool.js');
const router = express.Router();

console.log('in feed router');

router.post('/', (request, response)=>{
    console.log('in post new feed item', request.body);
    pool.query(`INSERT INTO feed (title, feed_text, feed_img_url, feed_video_url, feed_date_posted) VALUES ($1, $2, $3, $4, $5);`,
                [request.body.title, request.body.feed_text, request.body.feed_img, request.body.feed_video, request.body.feed_date])
                .then((result) => {
                    console.log('registered new feed');
                    response.sendStatus(201);
                })
                .catch((err) => {
                    console.log('error in feed' , err);
                    response.sendStatus(500);
                })
})


module.exports = router;
