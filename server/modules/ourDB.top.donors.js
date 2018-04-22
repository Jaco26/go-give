const pool = require('./pool');

// let result = [];
// let nonprofitIds = [1,2,3,4];
// let exitCondition = nonprofitIds.length;
// function getTopDonors (res) {
//     recursive (res)
// }

// async function recursive (res) {
//     if(result.length == 4){
//         res.send(result)
//         return 
//     }
//     let id = nonprofitIds[0];
//     await getTopDonorsForGivenNonprofit(id)
//     .then(response => {
//         result.push(response);
//         nonprofitIds.shift();
//         recursive(res);
//     })
//     .catch(err => {
//         console.log(err);        
//     });
   
// }

async function getTopDonors (nonprofitId, res) {
    let onetimeTopGivers = [];
    let subscriptionTopGivers = [];
    let allMonthlyGivers = [];

    const otdSqlText = `SELECT SUM(otd.amount_charged), users.id as user_id, users.first_name as username, np.id, np.name as nonprofit_name 
    FROM onetime_donations as otd JOIN users ON otd.user_id = users.id 
    JOIN nonprofit as np ON np.id = otd.nonprofit_id WHERE nonprofit_id = $1
    GROUP BY users.id, np.id
    ORDER BY sum DESC LIMIT 10;`
    await pool.query(otdSqlText, [nonprofitId])
        .then(response => {
         
            onetimeTopGivers = response.rows;
        })
        .catch(err => {
            console.log(err);  
            res.sendStatus(500);      
        });

    const sidSqlText = `SELECT SUM(sid.amount_paid), users.id as user_id, users.first_name as username, np.id, np.name as nonprofit_name 
    FROM invoices as sid JOIN users ON sid.user_id = users.id 
    JOIN nonprofit as np ON np.id = sid.nonprofit_id WHERE nonprofit_id = $1 
    GROUP BY users.id, np.id
    ORDER BY sum DESC LIMIT 10;`
    await pool.query(sidSqlText, [nonprofitId])
        .then(response => {
            subscriptionTopGivers = response.rows;
        })
        .catch(err => {
            console.log('ERR in sidSqlText POOL.QUERY >>>>>>>>>>>>', err);
            res.sendStatus(500);
        });
    
    const monthlyGiversSqlText = `SELECT DISTINCT users.id as user_id, users.name as username, users.fb_id 
    FROM users JOIN invoices as sid ON users.id = sid.user_id
    JOIN nonprofit as np ON sid.nonprofit_id = np.id
    WHERE np.id = $1 AND sid.subscription_status = 'active';`;
    await pool.query(monthlyGiversSqlText, [nonprofitId])
        .then(response => {
            allMonthlyGivers = response.rows;
        })
        .catch(err => {
            console.log(err);            
        });

    
    let topGiversSummary = {
        onetimeTopGivers: onetimeTopGivers,
        subscriptionTopGivers: subscriptionTopGivers,
        allMonthlyGivers: allMonthlyGivers,
        grandTotalsByUser: getGrandTotalsByUser(onetimeTopGivers, subscriptionTopGivers)
    };

    // return topGiversSummary;
    res.send(topGiversSummary);
}

function getGrandTotalsByUser (onetimeTopGivers, subscriptionTopGivers) {
    let combined = onetimeTopGivers.concat(subscriptionTopGivers);
    let unsortedTotals = combined.reduce( (a, b) => {
        if(a[b.username]){
            a[b.username].sum += Number(b.sum);
            return a;
        } else {
            a[b.username] = {
                sum: Number(b.sum), 
                username: b.username, 
                nonprofit_name: b.nonprofit_name, 
                id: b.id
            };
            return a;
        }
    }, {});
    return packageTotals (unsortedTotals)
}


function packageTotals (totals) {
    let keys = Object.keys(totals);
    let unsortedTotalsArray = keys.map(key => {
        return {
            username: totals[key].username, 
            sum: totals[key].sum, 
            nonprofit_name: totals[key].nonprofit_name, 
            id: totals[key].id
        };
    });
    return sortTotals (unsortedTotalsArray);
}

function sortTotals (unsorted) {
    return unsorted.sort( (a, b) => {
        return b.sum - a.sum
    });
}

module.exports = getTopDonors;




