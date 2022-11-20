const {createLogger, transports} = require('winston')

const logger = createLogger({
    level: 'info',
    transports: [
        new transports.File({filename: './wix-orders-check/wix-webhook/orders.log'})
    ]
});

module.exports = logger;

