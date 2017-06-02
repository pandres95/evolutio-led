'use strict';

const RPC = require('./rpc');
const SerialPort = require('serialport');

module.exports = async () => {
    const rpcClient = new RPC('../configuration/amqp');

    const list = await new Promise((res, thw) => SerialPort.list(
        (e, data) => (e !== undefined && e !== null) && thw(e) || res(data)
    ));
    let port;

    for(const i of list) {
        if(i.manufacturer !== undefined && i.manufacturer.includes('Arduino')) {
            port = i;
        }
    }

    const serial = new SerialPort(port.comName, {
        parser: SerialPort.parsers.readline('\r\n'),
        autoOpen: false
    });

    try {
        await new Promise((res, thw) => serial.open(
            err => (err !== undefined && err !== null) && thw(err) || res()
        ));
    } catch (error) {
        console.error(`serial.open(${error})`);
        return;
    }

    rpcClient.on('0.switchLight', async (params, next) => {
        console.log('~0.switchLight');

        let status = params.status;
        serial.write(status ? '1' : '0');

        let data = await new Promise((resolve, reject) => {
            serial.once('data', chunk => resolve(chunk.toString()));
            serial.once('error', reject);
        });

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
};
