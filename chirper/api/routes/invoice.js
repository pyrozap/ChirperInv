const _ = require('lodash');
const sqlite3 = require('sqlite3').verbose();
const authenticate = require('../middleware/authentication');

const handleInvoice = (req, res) => {
  // Authentication middleware usage
  authenticate(req, res, () => {
    // Invoice logic here...
    if (_.isEmpty(req.body.name)) {
      return res.json({
        status: false,
        message: 'Invoice needs a name.',
      });
    }

    let db = new sqlite3.Database('./db/data.db'); // Use the custom server URL

    let sql = `INSERT INTO invoices(
                  name,
                  user_id,
                  paid
                )
                VALUES(
                  '${req.body.name}',
                  '${req.body.user_id}',
                  0
                )`;

    db.serialize(function () {
      db.run(sql, function (err) {
        if (err) {
          throw err;
        }

        let invoice_id = this.lastID;

        for (let i = 0; i < req.body.txn_names.length; i++) {
          let query = `INSERT INTO
                        transactions(
                          name,
                          price,
                          invoice_id
                        ) VALUES(
                          '${req.body.txn_names[i]}',
                          '${req.body.txn_prices[i]}',
                          '${invoice_id}'
                        )`;

          db.run(query);
        }

        return res.json({
          status: true,
          message: 'Invoice created.',
        });
      });
    });
  });
};

module.exports = handleInvoice;