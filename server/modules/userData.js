
const pool = require('../modules/pool.js');




  async function getUser (id){
    let user;
    if(id){
    console.log('in get getUser', id);
    await pool.query('SELECT * FROM users WHERE fb_id = $1;', [id])
    .then((result) => {
      console.log('success in getUser', result.rows);
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
