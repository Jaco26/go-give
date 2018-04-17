const pool = require('./pool');

function filterOneTimeDonations(donations, response){

    let userDonatedNonprofits = [];

    //eliminate duplicate nonprofits
    let values = [];
    for (let i = 0; i < donations.length; i ++){
        value = donations[i].name;
        if (values.indexOf(value) === -1){
            userDonatedNonprofits.push(donations[i]);
            values.push(value);
        }
    }

    //add charges together
    for (let i = 0; i < userDonatedNonprofits.length; i ++){
        userDonatedNonprofits[i].totalCharged = 0;
        for (let j = 0; j < donations.length; j ++){
            if (userDonatedNonprofits[i].name == donations[j].name){
                userDonatedNonprofits[i].totalCharged += donations[j].amount_charged ;
            }
        }
    }

    //remove unnecessary 'amount_charged' property
    for(nonprofit of userDonatedNonprofits){
        delete nonprofit.amount_charged;
    }

    response.send(userDonatedNonprofits);

}

module.exports = filterOneTimeDonations;