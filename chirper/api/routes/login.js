const _ = require('lodash');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const config = require('../config');

const handleLogin = (req, res) => {
  let db = new sqlite3.Database('./db/data.db'); // Use the custom server URL

  let sql = `SELECT * from users where email='${req.body.email}'`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    db.close();

    if (rows.length == 0) {
      return res.json({
        status: false,
        message: 'Sorry, wrong email.',
      });
    }

    let user = rows[0];

    let authenticated = bcrypt.compareSync(req.body.password, user.password);

    delete user.password;

    if (authenticated) {
      const token = jwt.sign({ user }, config.jwtSecret); // Use the custom JWT secret
      return res.json({
        status: true,
        user: user,
        token: token,
      });
    }

    return res.json({
      status: false,
      message: 'Wrong password. Please retry.',
    });
  });
};

module.exports = handleLogin;