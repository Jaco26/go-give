
const pool = require('../modules/pool.js');

//this module provides access to the user data accross multiple routes in the app
//this module gets used anytime we need to verify that a logged in user is an
//administrator, any function that needs to be verified must have the user object passed to it
//this module needs to be called and have the users facebook id sent into it to check for the proper role.
  async function getUser (id){
    let user;
    if(id){
    console.log('in get getUser', id);
    await pool.query('SELECT * FROM users WHERE fb_id = $1;', [id])
    .then((result) => {
      console.log('success in getUser module', result.rows);
      if(result.rows.length > 0){
      user = result.rows[0];
        }
    })
    .catch((err) => {
      console.log('error in getUser', err);
      user = null;
      })
    console.log('user in module', user );
    return user;
  }
  else{
    user = null;
  }
}

module.exports = getUser;
