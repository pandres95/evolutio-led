'use strict';

const RPC = require('./rpc');
const SerialPort = require('serialport');

module.exports = () => {
    const rpcClient = new RPC('../configuration/amqp');
    const serial = new SerialPort('/dev/cu.usbmodem1421', { autoOpen: false });

    serial.open(error => {
        if(error !== undefined && error !== null) {
            console.log(`serial.open(${error})`);
            return;
        }

        rpcClient.on('0.switchLight', (params, next) => {
            let status = params.status;
            serial.write(status ? '1' : '0');
            next(status || false);
        });
    });
};
