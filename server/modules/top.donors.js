const pool = require('./pool');

async function getTopDonors (res) {
    let onetimeTopGivers = [];
    let subscriptionTopGivers = [];

    const otdSqlText = `SELECT SUM(otd.amount_charged), np.name as nonprofit_name, np.id as nonprofit_id, np.logo_url, users.name as user_name, users.id as user_id
    FROM onetime_donations as otd JOIN nonprofit as np ON otd.nonprofit_id = np.id
    JOIN users ON user_id = otd.user_id
    GROUP BY users.id, users.name, np.name, np.id, np.logo_url 
    ORDER BY sum LIMIT 10;`;
    await pool.query(otdSqlText, [])
        .then(response => {
         
            onetimeTopGivers = response.rows;
        })
        .catch(err => {
            console.log(err);  
            res.sendStatus(500);      
        });

    const sidSqlText = `SELECT SUM(sid.amount_charged), np.name as nonprofit_name, np.id as nonprofit_id, np.logo_url, users.name as user_name, users.id as user_id
    FROM invoices as sid JOIN nonprofit as np ON sid.nonprofit_id = np.id
    JOIN users ON user_id = sid.user_id
    GROUP BY users.id, users.name, np.name, np.id, np.logo_url 
    ORDER BY sum LIMIT 10;`;
    await pool.query(sidSqlText, [])
    .then(response => {
        subscriptionTopGivers = response.rows;
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
    
    let grandTotalsByUser = getGrandTotalsByUser(onetimeTopGivers, subscriptionTopGivers);
    let topGiversSummary = {
        onetimeTopGivers: onetimeTopGivers,
        subscriptionTopGivers: subscriptionTopGivers,
        grandTotalsByUser: grandTotalsByUser
    };

    // res.send(topGiversSummary);

}

function getGrandTotalsByUser (onetimeTopGivers, subscriptionTopGivers) {
    
}


module.exports = getTopDonors;