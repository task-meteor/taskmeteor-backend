const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const auth = require('../router/auth/auth-router.js');


const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] Was method "${req.method}" to address "${req.path}"`);
    next();
}

const server = express();

server.use(helmet());
server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(logger);


server.get('/', (req, res) => {
    res.send("It's alive!");
  });

server.use('/auth', auth);


module.exports = server;