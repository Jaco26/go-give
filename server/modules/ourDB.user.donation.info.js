const pool = require('./pool');

// function getUsersDonationHistory (user_id, res) {
//     getUsersOnetimeDonationHistory(user_id, res);
// }


// function getUsersOnetimeDonationHistory (user_id, res) {
//     const sqlText = `SELECT otd.id, otd.amount_charged, np.name, np.logo_url, np.id 
//     FROM onetime_donations as otd JOIN nonprofit as np ON otd.product_id = np.product_id
//     WHERE user_id = $1;`;
//     pool.query(sqlText, [user_id])
//     .then(response => {
//         let usersDonations = {userId: user_id, onetime: response.rows};
//         usersDonations.onetimeTotals = sumDonationsByNonprofit(usersDonations.onetime);
//         getUsersSubscriptionInvoiceHistory(usersDonations, user_id, res);
//     })
//     .catch(err => {
//         console.log(err); 
//         res.sendStatus(500);
//     });
// }


// function getUsersSubscriptionInvoiceHistory (usersDonations, user_id, res) {
//     const sqlText = `SELECT sid.id, sid.amount_paid, np.name, np.logo_url, np.id 
//     FROM invoices as sid JOIN nonprofit as np ON sid.product_id = np.product_id
//     WHERE user_id = $1;`;
//     pool.query(sqlText, [user_id])
//     .then(response => {
//         usersDonations = {...usersDonations, invoices: response.rows};
//         console.log('USERS DONATIONS TOTALS ______------', usersDonations.totals);
//         usersDonations.subscriptionTotals = sumDonationsByNonprofit(usersDonations.invoices);
//         usersDonations.totals = sumTotals(usersDonations)
//         res.send(usersDonations)
//     })
//     .catch(err => {
//         console.log(err);
//         res.sendStatus(500);
//     });
// }

// function sumTotals(usersDonations) {

// }

// function sumDonationsByNonprofit(donations) {
//     // donations is an array of objects each object includes these properties:
//     // an integer 'amount_charged' and the corrosponding
//     // nonprofit's name as the string 'name'
//     let nonprofitNames = donations.map(donation => donation.name);    
//     let distinctNames = [...new Set(nonprofitNames)];    
//     return organizeChargesByName(distinctNames, donations)
// }

// function organizeChargesByName(distinctNames, donations) {
//     let totals = [];
//     distinctNames.forEach(name => {
//         let totalsForThisName = { name: name, total: 0 };
//         donations.forEach(donation => {
//             if (donation.name == name) {
//                 if (donation.amount_charged) {
//                     totalsForThisName.total += donation.amount_charged;
//                 } else if (donation.amount_paid) {
//                     totalsForThisName.total += donation.amount_paid;
//                 }
//             }
//         });
//         totals.push(totalsForThisName);
//     });
//     return totals;
// }

// AND NOW TO DO THIS A LOT MORE QUICKLY WITH SQL...(ugh)

function getUsersDonationTotals (user_id, res) {
    getOnetimeTotals(user_id, res);
}

function getOnetimeTotals (user_id, res) {
    const sqlText = `SELECT SUM(otd.amount_charged), np.name, np.logo_url 
    FROM onetime_donations as otd JOIN nonprofit as np ON otd.product_id = np.product_id
    WHERE user_id = $1 
    GROUP BY np.name, np.logo_url;`;
    pool.query(sqlText, [user_id])
    .then(response => {
        // console.log('RESPONSE FROM SUM AND GROUP BY ATTEMPT ---------', response.rows);
        let onetimeTotals = response.rows;
        getSubscriptionTotals(user_id, res, onetimeTotals);
    })
}

function getSubscriptionTotals (user_id, res, onetimeTotals) {
    const sqlText = `SELECT SUM(sid.amount_paid), np.name, np.logo_url 
    FROM invoices as sid JOIN nonprofit as np ON sid.product_id = np.product_id
    WHERE user_id = $1 
    GROUP BY np.name, np.logo_url;`;
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

function getGrandTotalsByName (onetimeTotals, subscriptionTotals) {
    return onetimeTotals.concat(subscriptionTotals).reduce( (a, b, index, array) => {
        if (a[b.name]){
            a[b.name] += Number(b.sum);
            return a;
        } else {
            a[b.name] = Number(b.sum);
            return a;
        }
    }, {});
}


module.exports = getTotals;