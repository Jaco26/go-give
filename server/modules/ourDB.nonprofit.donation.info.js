const pool = require('./pool');

// class Totals {
//     constructor(pool){
//         this._pool = pool;
//         this._onetime;
//         this._subscription;
//         this._totals;
//     }

//     getOnetime (nonprofit_id) {
//         const sqlText = `SELECT SUM(otd.amount_charged), np.name, np.logo_url, np.id
//         FROM onetime_donations as otd JOIN nonprofit as np ON otd.nonprofit_id = np.id
//         WHERE nonprofit_id = $1
//         GROUP BY np.name, np.logo_url, np.id;`;
//         this._pool.query(sqlText, [nonprofit_id])
//         .then(response => {
//             this._onetime = response
//             this.getSubsctiption(nonprofit_id);
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }

//     getSubsctiption (nonprofit_id) {
//         const sqlText = `SELECT SUM(sid.amount_paid), np.name, np.logo_url, np.id
//         FROM invoices as sid JOIN nonprofit as np ON sid.nonprofit_id = np.id
//         WHERE nonprofit_id = $1
//         GROUP BY np.name, np.logo_url, np.id;`;
//         this._pool.query(sqlText, [nonprofit_id])
//         .then(response => {
//             this._subscription = response;
//             this.getGrandTotals ();
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }

//     getGrandTotals () {
//         let totalsObject = this._onetime.concat(this._subscription);
//         totalsObject.reduce((a, b) => {
//             if (a[b.name]) {
//                 a[b.name].sum += Number(b.sum);
//                 return a;
//             } else {
//                 a[b.name] = { sum: Number(b.sum), logo_url: b.logo_url, id: b.id };
//                 return a;
//             }
//         }, {});
//         const packagedTotals = packageTotals(totalsObject);
//         return packagedTotals;
//     }

//     packageTotals (totalsObject) {
//         let keys = Object.keys(totalsObject);
//         let totalsArray = keys.map(key => {
//             return { name: key, sum: totalsObject[key].sum, logo_url: totalsObject[key].logo_url, id: totalsObject[key].id };
//         });
//         this._totals = totalsArray;
//     }

// }


// function getTotals (nonprofits, res) {
//     for (let i = 0; i < nonprofits.length; i++) {
//         let nonprofit = nonprofits[i];
//         let info = new Totals(pool);
//         info.getOnetime(nonprofit.id);
//         console.log(info._totals);
        
//     }
// }


// module.exports = getTotals;




function getTotals(nonprofits, res) {
    // console.log('747474747474#@####*#*$*%*#$*', getTotalGiven(nonprofits));
    // test()
    // let total = new Totals()
    console.log('FINAL TO SEND ********', getTotalGiven(nonprofits));
    res.send(getTotalGiven(nonprofits));
}

function getTotalGiven (nonprofits, res) {
    let totals = [];
    let packageToSend = [];
    for(let i = 0; i < nonprofits.length; i++) {
        let nonprofit = nonprofits[i];
        // console.log('GET TOTALS FROM ONETIME #######', getTotalsFromOnetime(nonprofit.id))
        getTotalsFromOnetime(nonprofit.id, packageToSend)
            .then(response => {
                console.log('RESPONSE FROM getTotalsFromOnetime', response);
                totals.push(response);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            })
        if (i == nonprofits.length - 1) {
            console.log('TOTALS TOTALS TOTALS *****', totals);
            
            return totals;
        }
    }

}

async function getTotalsFromOnetime (nonprofit_id, packageToSend) {
    const sqlText = `SELECT SUM(otd.amount_charged), np.name, np.logo_url, np.id
    FROM onetime_donations as otd JOIN nonprofit as np ON otd.nonprofit_id = np.id
    WHERE nonprofit_id = $1
    GROUP BY np.name, np.logo_url, np.id;`;
    let onetimeTotals;
    await pool.query(sqlText, [nonprofit_id])
    .then(response => {
        onetimeTotals = response.rows;
        getTotalsFromSubscription(nonprofit_id, onetimeTotals)
        .then(response => {
            console.log('RESPONSE AFTER getTotalsFromSubscription *********************', response);
        })
        .catch(err => {
            console.log(err);            
        });

    })
    .catch(err => {
        console.log(err);
    });
}

// function test () {
//     getTotalsFromSubscription("1", [{name: 'Jacob\'s Org', sum: 8}])
//     // console.log(' AWAITED Hi' , hi);
    
//     .then(response => {
//         console.log('RESPONSE FROM test ********', response);
        
//     })
// }


async function getTotalsFromSubscription (nonprofit_id, onetimeTotals) {
    const sqlText = `SELECT SUM(sid.amount_paid), np.name, np.logo_url, np.id
    FROM invoices as sid JOIN nonprofit as np ON sid.nonprofit_id = np.id
    WHERE nonprofit_id = $1
    GROUP BY np.name, np.logo_url, np.id;`;
    let grandTotals;
    await pool.query(sqlText, [nonprofit_id])
    .then(response => {
        let subscriptionTotals = response.rows;
        grandTotals = getGrandTotalsByName(onetimeTotals, subscriptionTotals);
    })
    .catch(err => {
        console.log(err);
    })
    return grandTotals;
}

function getGrandTotalsByName (onetimeTotals, subscriptionTotals) {
    let totalsObject = onetimeTotals.concat(subscriptionTotals).reduce((a, b) => {
        if(a[b.name]) {
            a[b.name].sum += Number(b.sum);
            return a;
        } else {
            a[b.name] = {sum: Number(b.sum), logo_url: b.logo_url, id: b.id};
            return a;
        }
    }, {});
    const packagedTotals = packageTotals (totalsObject);
    return packagedTotals;
}

function packageTotals (totalsObject) {
    let keys = Object.keys(totalsObject);
    let totalsArray = keys.map(key => {
        return {name: key, sum: totalsObject[key].sum, logo_url: totalsObject[key].logo_url, id: totalsObject[key].id};
    });
    return totalsArray;
}

module.exports = getTotals;