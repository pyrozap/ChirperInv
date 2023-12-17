const _ = require('lodash');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const saltRounds = 10;

const handleRegister = (req, res) => {
  if (
    _.isEmpty(req.body.name) ||
    _.isEmpty(req.body.email) ||
    _.isEmpty(req.body.company_name) ||
    _.isEmpty(req.body.password)
  ) {
    return res.json({
      status: false,
      message: 'All fields are required.',
    });
  }

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    let db = new sqlite3.Database('./db/data.db'); // Use the custom server URL

    let sql = `INSERT INTO
                users(
                  name,
                  email,
                  company_name,
                  password
                )
                VALUES(
                  '${req.body.name}',
                  '${req.body.email}',
                  '${req.body.company_name}',
                  '${hash}'
                )`;

    db.run(sql, function (err) {
      if (err) {
        throw err;
      } else {
        return res.json({
          status: true,
          message: 'User Created.',
        });
      }
    });

    db.close();
  });
};

module.exports = handleRegister;