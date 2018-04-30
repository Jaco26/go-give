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
SERVER_SESSION_SECRET='<YOUR_KEY_HERE>'
FILESTACK_KEY='<YOUR_KEY_HERE>'
DEV=‘false’
DEPLOY_REDIRECT_URL=’https://cogiv.herokuapp.com/auth/facebook/callback'
LOCALHOST_REDIRECT_URL=‘https://localhost:4430/auth/facebook/callback’
```

You will also need to create a database: 

In Postico, create a "New Favorite" with "Host" set to ``localhost`` and "Port" set to ``5432``. Then create a new "Database" named ``co_giv``. Next, copy and paste the contents of the ``database.sql`` file into the SQL Query window.


You will need to create and register a new application with Facebook.
Go to developers.facebook.com and log in.
From the 'My Apps' menu on the top right select 'add a new app'.
Enter the information when prompted, and click 'Create App Id'.
After that In the 'Facebook Login' box select 'Set Up'.
Select 'Web'.
Enter the sites Url and click continur.
Hit next through the next 3 pages.
Copy the App Id and paste it into youe .env file.
Select the main settings, then 'basic'. Click 'show secret', then copy and paste that into youe .env.

You will need to provide Facebook with a Valid OAuth Redirect URI:
for local development use 'https://localhost:4430/auth/facebook/callback'.
For deployment replace 'localhost:4430' with the site domain.

You will need to provide Facebook with the domain of the site, do this in the basic settings, for local development use 'localhost:4430' for deployment use the site domain.
Also, in the basic settings provide the site URL, again for local development use 'localhost:4430' and for deployment use the app domain.
