'use strict';
const express = require('express');
const router = express.Router();
const io = require('../io');
const ac = require('../model/ac');

/* GET index */
router.get('/', function (req, res, next) {
    res.render('index', {});
});

/* Event Listener for name */
function relayEventListener(name, socket) {
    socket.on(name, function (data) {
        ac(name, data);
    });
}

/* Open socket on Connection */
io.on('connection', function (socket) {
    relayEventListener('cool', socket);
    relayEventListener('heat', socket);
    relayEventListener('off', socket);
    console.log('client connected.'); //show a log as a new client connects.
});

module.exports = router;