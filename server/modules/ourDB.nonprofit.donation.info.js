const pool = require('./pool');

async function getTotalGiven (nonprofitIds, res) {
    let onetimeTotals = [];
    let subscriptionTotals = [];

//// --- Ultimately want to do what these two queries do into one. Also, "ANY ('{${nonprofitIds}}')" 
//      should be fixed to be more secure
    const sqlText = `SELECT SUM(otd.amount_charged), np.name, np.logo_url, np.id
    FROM onetime_donations as otd JOIN nonprofit as np ON otd.nonprofit_id = np.id
    WHERE nonprofit_id = ANY ('{${nonprofitIds}}')
    GROUP BY np.name, np.logo_url, np.id;`;
    await pool.query(sqlText, [])
        .then(response => {
            onetimeTotals = response.rows;
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
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
    
    let grandTotalsByNonprofit = getGrandTotalsByName(onetimeTotals, subscriptionTotals);
    let totalsSummary = { 
        onetimeTotals: onetimeTotals, 
        subscriptionTotals: subscriptionTotals, 
        grandTotals: grandTotalsByNonprofit 
    };
    // return totalsSummary;
    res.send(totalsSummary);

}

function getGrandTotalsByName(onetimeTotals, subscriptionTotals) {
    let totalsObject = onetimeTotals.concat(subscriptionTotals).reduce((a, b) => {
        if (a[b.name]) {
            a[b.name].sum += Number(b.sum);
            return a;
        } else {
            a[b.name] = { 
                sum: Number(b.sum), 
                logo_url: b.logo_url, 
                nonprofit_id: b.id,
            };
            return a;
        }
    }, {});
    return packageTotals(totalsObject);
}

function packageTotals(totalsObject) {
    let keys = Object.keys(totalsObject);
    let totalsArray = keys.map(key => {
        return { 
            name: key, 
            sum: totalsObject[key].sum, 
            logo_url: totalsObject[key].logo_url,
            nonprofit_id: totalsObject[key].id,
        };
    });
    return totalsArray;
}


module.exports = getTotalGiven;
