const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//////////////////////////////////////////////////////////////////////////////////////////////////////////
///// These functions generate an array of objects which will be used to generate a report for a       ///
///// given user's one-time donations. Each one contains a 'productId' with stripes prod_id AND a     ///
///// 'charges' array of the stripe.charge objects whose metadata.product_id matches the 'productId' ///
///////////////////////////////////////////////////////////////////////////////////////////////////////
function filterDataForUserReportOnOnetimeDonations(charges, customerId, res) {
    filterChargesByUser(charges, customerId, res);
}

function filterChargesByUser(charges, customerId, res) {
    const userCharges = charges.data.filter(charge => charge.customer == customerId);
    getUniqueProductIdsFromUserCharges(userCharges, res);
}

function getUniqueProductIdsFromUserCharges(userCharges, res) {
    let productIds = [];
    for (let charge of userCharges) {
        if (!charge.metadata.product_id) {
            continue;
        } else {
            productIds.push(charge.metadata.product_id);
        }
    }
    let uniqueProductIds = [...new Set(productIds)];
    organizeChargesByProductChargedFor(uniqueProductIds, userCharges, res);
}

function organizeChargesByProductChargedFor(uniqueProductIds, userCharges, res) {
    let chargesByProduct = [];
    uniqueProductIds.forEach((uniqueId, i) => {
        let product = { productId: uniqueId, charges: [] };
        userCharges.forEach(charge => {
            if (charge.metadata.product_id == uniqueId) {
                product.charges.push(charge);
            }
        });
        chargesByProduct.push(product)
        i == uniqueProductIds.length - 1 ? res.send(chargesByProduct) : null;
    });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
///// These functions generate an array of objects which will be used to generate a report for a       ///
///// given user's subscription donations.                                                            ///
////////////////////////////////////////////////////////////////////////////////////////////////////////


function filterDataForUserReportOnSubscriptionDonations(invoices, customerId, res) {
    let userInvoices = invoices.data.filter(invoice => invoice.customer == customerId);
    filterInvoicesByProduct(userInvoices, res)
}

function filterInvoicesByProduct(userInvoices, res) {
    let productIds = userInvoices.map(invoice => invoice.lines.data[0].plan.product);
    let uniqueProductIds = [...new Set(productIds)];
    organizeInvoicesByProductSubscribedTo(uniqueProductIds, userInvoices, res);
}

function organizeInvoicesByProductSubscribedTo(uniqueProductIds, userInvoices, res) {
    let invoicesByProduct = [];
    uniqueProductIds.forEach((uniqueId, i) => {
        let product = { productId: uniqueId, invoices: [] };
        userInvoices.forEach(invoice => {
            if (invoice.lines.data[0].plan.product == uniqueId) {
                product.invoices.push(invoice);
            }
        });
        invoicesByProduct.push(product);
        i == uniqueProductIds.length - 1 ? res.send(invoicesByProduct) : null;
    });
}


module.exports = {
    filterDataForUserReportOnOnetimeDonations: filterDataForUserReportOnOnetimeDonations,
    filterDataForUserReportOnSubscriptionDonations: filterDataForUserReportOnSubscriptionDonations,
}