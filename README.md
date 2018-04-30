# Co-giv

Co-giv is a social media platform that gives service non profit organizations exposure to new audiences. It creates an environment where non-profit giving is a more collective, rewarding experience for donors. With co-giv, users will be able to discover nonprofits working toward causes that they care about, subscribe to make monthly donations to the charities they feel passionate about, and receive meaningful feedback about their own impact over time as well as the collective impact of the community of fellow co-givers. Cogiv amplifies the impact of micro-donating on a collective level and makes its consequences felt. 

## Built With:
- AngularJS / Angular Material
- Express.js
- Node.js
- PostgreSQL
- Stripe.js
- Passport-facebook
- Node-postgres

## Getting Started:

### Prerequisites:

To get cogiv running on your machine locally, you will need:

- <a href="https://nodejs.org">Node.js</a> 
- <a href="https://www.postgresql.org/">Postgres</a> 
- <a href="https://eggerapps.at/postico/">Postico</a>
- A Filestack <a href="https://dev.filestack.com/signup/free/">API key</a>
- A Facebook Developer <a href="https://developers.facebook.com/tools/accesstoken/">access token</a>
- To create a Stripe <a href="https://stripe.com/get-started?&utm_campaign=paid_brand&utm_medium=cpc&utm_source=google&ad_content=261743943756&utm_term=stripee&utm_matchtype=b&utm_adposition1t1&utm_device=c&gclid=Cj0KCQjw_ZrXBRDXARIsAA8KauQz9pTbsqF2Eeos9HMBJ2Jpi2pdT81U_SgxpSzFC5BPHql5fJ_00LUaAvYSEALw_wcB">account</a> and get access keys.


### Installing:
- Download the Zip
- ```npm install```
- ```npm start```

You will need to create a .env file in the project root. There you will need to store the following:

```
STRIPE_SECRET_KEY=‘<YOUR_KEY_HERE>’
FACEBOOK_APP_SECRET='<YOUR_KEY_HERE>'
FACEBOOK_APP_ID='<YOUR_KEY_HERE>'
SERVER_SESSION_SECRET='VCHADLQncP4P2B59vQ4C'
FILESTACK_KEY='<YOUR_KEY_HERE>'
DEV=‘false’
DEPLOY_REDIRECT_URL=’https://cogiv.herokuapp.com/auth/facebook/callback'
LOCALHOST_REDIRECT_URL=‘https://localhost:4430/auth/facebook/callback’
```



You will need to create a database: 

In Postico, after starting create a "New Favorite" with "Host" set to ``localhost`` and "Port" set to ``5432``. 