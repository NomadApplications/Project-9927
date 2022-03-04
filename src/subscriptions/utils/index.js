const PRODUCT_INFO = {
    'Project9927': {
        subheader: 'This is the subheader'
    },
};

const PLAN_INFO = {
    'price_1KX5TWB12a19Nx8Ngdm1GFJw': {
        features: [
            '10 teams',
            '10 projects'
        ],
    },
    'price_1KX5UrB12a19Nx8NWpiFEEcq': {
        features: [
            'Unlimited teams',
            'Unlimited projects'
        ],
    }
}

function getValue(obj, property, defaultValue) {
    return obj && obj[property] ? obj[property] : defaultValue;
}

function formatUSD(stripeAmount){
    return `$${(stripeAmount / 100).toFixed(2)}`;
}

function formatStripAmount(USDString){
    return parseFloat(USDString) * 100;
}

module.exports = {
    PRODUCT_INFO,
    PLAN_INFO,
    getValue,
    formatUSD,
    formatStripAmount
}