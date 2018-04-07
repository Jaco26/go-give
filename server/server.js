const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('server/public'));

// Route includes
const stripeRouter = require('./routes/stripe.router');
const nonprofitRouter = require('./routes/nonprofit.router');
const feedRouter = require('./routes/feed.router');
const reportRouter = require('./routes/report.router');
const userRouter = require('./routes/user.router');

/* Routes */
app.use('/stripe', stripeRouter);
app.use('/nonprofit', nonprofitRouter);
app.use('/feed', feedRouter);
app.use('/report', reportRouter);
app.use('/user', userRouter);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server ready on PORT:', PORT);
});
