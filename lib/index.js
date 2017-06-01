'use strict';

const RPC = require('./rpc');

module.exports = async () => {
    const rpcClient = new RPC('../configuration/amqp');

    rpcClient.on('0.switchLight', (params, next) => {
        console.log('0.switchLight', params);
        next(params.status || false);
    });
};
