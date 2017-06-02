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
            
            serial.once('data', data => {
                let response = {};
    
                if(data === 'NC') {
                    response.status = 'no conectado';
                } else if(data === 'OFF') {
                    response.status = 'apagado';
                } else {
                    response.status = 'encendido';
                    let parameters = data.split(', ');

                    for(let parameter of parameters) {
                        let key = parameter.split(': ')[0];
                        let value = parameter.split(': ')[1];
                        response[key] = value;
                    }
                }

                next(response);
            });
        });
    });
};
