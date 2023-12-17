"use strict";

const Promise = require('bluebird');
const sqlite3 = require('sqlite3').verbose(); // Use verbose mode for better error handling
const fs = require('fs');
const generator = require('generate-password');
module.exports = {
  up: function () {
    return new Promise(function (resolve, reject) {
      // Integration of SQLITE3 dependencies
      const db = new sqlite3.Database('./db/data.db');

      // Enable foreign key support
      db.run(`PRAGMA foreign_keys = ON`);

      // Creation of the DB as well as the tables contained in it
      db.serialize(function () {
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          name TEXT,
          email TEXT,
          company_name TEXT,
          password TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS invoices (
          id INTEGER PRIMARY KEY,
          name TEXT,
          user_id INTEGER,
          paid NUMERIC,
          FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY,
          name TEXT,
          price INTEGER,
          invoice_id INTEGER,
          FOREIGN KEY(invoice_id) REFERENCES invoices(id)
        )`);
      });
     });
    }
  };

      // Read config.js file
  fs.readFile('config.js', 'utf-8', function (err, data) {
   if (err) throw err;

   // Generate a new API password
   const pass = generator.generate({
     length: 32,
     numbers: true,
   });

   // Replace the placeholder password in the config file
   const newapipassword = data.replace(/passwordtochange/gim, pass);

   // Write the new API password to the config file
   fs.writeFile('config.js', newapipassword, 'utf-8', function (err) {
     if (err) throw err;
     console.log('Setup the new API password: done. ✔️');

     // Read config.js file again
     fs.readFile('config.js', 'utf-8', function (err, data) {
       if (err) throw err;

       // Replace 'false' with 'true' to indicate that setup is done
       const setupdone = data.replace(/false/gim, 'true');

       // Write the updated setup status to the config file
       fs.writeFile('config.js', setupdone, 'utf-8', function (err) {
         if (err) throw err;
         console.log('Automatic setup: done. ✔️');
       });
     });
   });
 });
