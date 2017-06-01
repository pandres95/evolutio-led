'use strict';

const RPC = require('amqp-rpc');
const URL = require('url');
const _   = require('underscore');

module.exports = class {
    constructor(file) {
        let configuration;

        try {
            configuration = (require(file) || {})[
                process.env.NODE_ENV || 'development'
            ] || {};
        } catch(e) {
            configuration = {};
        }

        this.__manager = RPC.factory(_({
            url: URL.format({
                protocol: 'amqp',
                slashes: true,
                auth: `${
                    configuration.username || configuration.user || 'guest'
                }:${
                    configuration.password || configuration.pass || 'guest'
                }`,
                hostname: configuration.host || 'localhost',
                port: configuration.port || '',
                pathname: configuration.vhost || ''
            })
        }).extend(configuration.options || {}));

    }

    on(event, callback) { this.__manager.on(event, callback); }

    call(event = '', params = {}, cb = () => {}) {
        this.__manager.call(event, params, cb);
    }
};
