// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const handleRegister = require('./routes/register');
const handleLogin = require('./routes/login');
const handleInvoice = require('./routes/invoice');

const config = require('./config');
const auth = require('./middleware/authentication');

if (config.setupdone == 'false') setup();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/register', handleRegister);
app.post('/login', handleLogin);
app.post('/invoice', auth, handleInvoice); // Using authentication middleware for the /invoice route

app.listen(config.port || 80, function () {
    console.log('http://localhost:' + config.port);
});