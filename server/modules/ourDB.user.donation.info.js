const pool = require('./pool');

function getUsersDonationTotals (user_id, res) {
    getOnetimeTotals(user_id, res);
}

function getOnetimeTotals (user_id, res) {
    const sqlText = `SELECT SUM(otd.amount_charged), np.name, np.logo_url, np.id
    FROM onetime_donations as otd JOIN nonprofit as np ON otd.product_id = np.product_id
    WHERE user_id = $1 
    GROUP BY np.name, np.logo_url, np.id;`;
    pool.query(sqlText, [user_id])
    .then(response => {
        // console.log('RESPONSE FROM SUM AND GROUP BY ATTEMPT ---------', response.rows);
        let onetimeTotals = response.rows;
        getSubscriptionTotals(user_id, res, onetimeTotals);
    })
}

function getSubscriptionTotals (user_id, res, onetimeTotals) {
    const sqlText = `SELECT SUM(sid.amount_paid), np.name, np.logo_url, np.id
    FROM invoices as sid JOIN nonprofit as np ON sid.product_id = np.product_id
    WHERE user_id = $1 
    GROUP BY np.name, np.logo_url, np.id;`;
    pool.query(sqlText, [user_id])
    .then(response => {
        let subscriptionTotals = response.rows;
        let grandTotalsByName = getGrandTotalsByName(onetimeTotals, subscriptionTotals);
        let totalsSummary = {onetimeTotals: onetimeTotals, subscriptionTotals: subscriptionTotals, grandTotals: grandTotalsByName};
        res.send(totalsSummary);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);        
    });
}

function getGrandTotalsByName(onetimeTotals, subscriptionTotals) {
    let totals = onetimeTotals.concat(subscriptionTotals).reduce((a, b, index, array) => {
        if (a[b.name]) {
            a[b.name].sum += Number(b.sum);
            return a;
        } else {
            a[b.name] = {sum: Number(b.sum), logo_url: b.logo_url, id: b.id};
            return a;
        }
    }, {});
    return packageTotals(totals);
}

function packageTotals (totalsObject) {
    let keys = Object.keys(totalsObject);
    let totalsArray = keys.map(key => {
        return {name: key, sum: totalsObject[key].sum, logo_url: totalsObject[key].logo_url, id: totalsObject[key].id};
    });
    return totalsArray
}


module.exports = getUsersDonationTotals;