require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_API);

const UTILS = require("./utils/index");

function formatProducts(products){
    products.forEach(product => {
        product.subheader = UTILS.getValue(UTILS.PRODUCT_INFO[product.name], 'subheader', '');
    });
    return products;
}

function sortAndFormatPlans(plans){
    plans = plans.sort((a, b) => {
        return a.amount - b.amount;
    });

    plans.forEach(plan => {
        plan.amount = UTILS.formatUSD(plan.amount);
        plan.formatted = JSON.stringify(plan);
        plan.features = UTILS.getValue(UTILS.PLAN_INFO[plan.id], 'features', []);
    });
    return plans;
}

function attachPlansToProducts(plans, products){
    products.forEach(product => {
        const filteredPlans = plans.filter(plan => {
            return product.id === plan.product;
        });
        product.plans = filteredPlans;
    });
    return products.filter(product => product.plans.length > 0);
}

function getProductsAndPlans(){
    return Promise.all([
        stripe.products.list({}),
        stripe.plans.list({}),
        ]).then(stripeData => {
        const products = formatProducts(stripeData[0].data);
        const plans = sortAndFormatPlans(stripeData[1].data);
        return attachPlansToProducts(plans, products);
    }).catch(err => {
        console.error("Error fetching Stripe products and plans: ", err);
        return [];
    });
}

async function createCustomerAndSubscription(paymentMethodId, customerInfo) {
    const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: customerInfo.email,
        name: customerInfo.name,
        invoice_settings: {
            default_payment_method: paymentMethodId,
        },
    });

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
            plan: customerInfo.planId,
        }],
        trial_from_plan: true, /* Use trial period specified in plan */
        expand: ["latest_invoice.payment_intent"],
    });

    return subscription;
}

module.exports = {
    getProductsAndPlans,
    createCustomerAndSubscription
};