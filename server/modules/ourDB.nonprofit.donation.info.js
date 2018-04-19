const pool = require('./pool');

async function getTotalGiven (nonprofitIds, res) {
    // console.log('NONPROFIT IDS NONFRAFSDF &&&***', nonprofitIds);
        
    let onetimeTotals = [];
    let subscriptionTotals = [];


    const sqlText = `SELECT SUM(otd.amount_charged), np.name, np.logo_url, np.id
    FROM onetime_donations as otd JOIN nonprofit as np ON otd.nonprofit_id = np.id
    WHERE nonprofit_id = ANY ('{${nonprofitIds}}')
    GROUP BY np.name, np.logo_url, np.id;`;
    await pool.query(sqlText, [])
        .then(response => {
            console.log('RESPONSE FOR FIRST ONE #####', response);
            onetimeTotals = response.rows;
            // let onetimeTotals = response.rows;
            // getTotalsFromSubscription(nonprofit_id, res, onetimeTotals);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
    const sqlText2 = `SELECT SUM(sid.amount_paid), np.name, np.logo_url, np.id
    FROM invoices as sid JOIN nonprofit as np ON sid.nonprofit_id = np.id
    WHERE nonprofit_id = ANY ('{${nonprofitIds}}')
    GROUP BY np.name, np.logo_url, np.id;`;
    await pool.query(sqlText2, [])
        .then(response => {
            subscriptionTotals = response.rows;
            // let grandTotalsByName = getGrandTotalsByName(onetimeTotals, subscriptionTotals);
            // let totalsSummary = { onetimeTotals: onetimeTotals, subscriptionTotals: subscriptionTotals, grandTotals: grandTotalsByName };
            // res.send(totalsSummary);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
    console.log('onetimeTotals', onetimeTotals);
    console.log('subscriptionTotals', subscriptionTotals);
    let grandTotalsByName = getGrandTotalsByName(onetimeTotals, subscriptionTotals);
    let totalsSummary = { onetimeTotals: onetimeTotals, subscriptionTotals: subscriptionTotals, grandTotals: grandTotalsByName };
    res.send(totalsSummary);

}


function getGrandTotalsByName(onetimeTotals, subscriptionTotals) {
    let totalsObject = onetimeTotals.concat(subscriptionTotals).reduce((a, b) => {
        if (a[b.name]) {
            a[b.name].sum += Number(b.sum);
            return a;
        } else {
            a[b.name] = { sum: Number(b.sum), logo_url: b.logo_url, id: b.id };
            return a;
        }
    }, {});
    return packageTotals(totalsObject);
}

function packageTotals(totalsObject) {
    let keys = Object.keys(totalsObject);
    let totalsArray = keys.map(key => {
        return { name: key, sum: totalsObject[key].sum, logo_url: totalsObject[key].logo_url, id: totalsObject[key].id };
    });
    return totalsArray;
}



// function getTotalsFromOnetime (nonprofit_id, res) {
//     const sqlText = `SELECT SUM(otd.amount_charged), np.name, np.logo_url, np.id
//     FROM onetime_donations as otd JOIN nonprofit as np ON otd.nonprofit_id = np.id
//     WHERE nonprofit_id = $1
//     GROUP BY np.name, np.logo_url, np.id;`;
//     pool.query(sqlText, [nonprofit_id])
//     .then(response => {
//         let onetimeTotals = response.rows;
//         getTotalsFromSubscription(nonprofit_id, res, onetimeTotals);
//     })
//     .catch(err => {
//         console.log(err);
//         res.sendStatus(500);        
//     });
// }

// function getTotalsFromSubscription (nonprofit_id, res, onetimeTotals) {
//     const sqlText = `SELECT SUM(sid.amount_paid), np.name, np.logo_url, np.id
//     FROM invoices as sid JOIN nonprofit as np ON sid.nonprofit_id = np.id
//     WHERE nonprofit_id = $1
//     GROUP BY np.name, np.logo_url, np.id;`;
//     pool.query(sqlText, [nonprofit_id])
//     .then(response => {
//         let subscriptionTotals = response.rows;
//         let grandTotalsByName = getGrandTotalsByName(onetimeTotals, subscriptionTotals);
//         let totalsSummary = {onetimeTotals: onetimeTotals, subscriptionTotals: subscriptionTotals, grandTotals: grandTotalsByName};
//         res.send(totalsSummary);
//     })
//     .catch(err => {
//         console.log(err);
//         res.sendStatus(500);
//     })
// }

// function getGrandTotalsByName (onetimeTotals, subscriptionTotals) {
//     let totalsObject = onetimeTotals.concat(subscriptionTotals).reduce((a, b) => {
//         if(a[b.name]) {
//             a[b.name].sum += Number(b.sum);
//             return a;
//         } else {
//             a[b.name] = {sum: Number(b.sum), logo_url: b.logo_url, id: b.id};
//             return a;
//         }
//     }, {});
//     return packageTotals (totalsObject);
// }

// function packageTotals (totalsObject) {
//     let keys = Object.keys(totalsObject);
//     let totalsArray = keys.map(key => {
//         return {name: key, sum: totalsObject[key].sum, logo_url: totalsObject[key].logo_url, id: totalsObject[key].id};
//     });
//     return totalsArray;
// }

module.exports = getTotalGiven;
