"use strict";

const mysql = require("mysql2");
const { uri } = require("../config/dbLoginSettings.config.json");

class Database {
  constructor(uri) {
    this.uri = uri;
    this.con = null;
    this.checkSchema();
  }

  async createConnection() {
    this.con = await mysql.createConnection({
      uri: this.uri,
    });
    return this.con;
  }

  execQueryPromise(query, values) {
    return new Promise((resolve, reject) => {
      this.con.query(query, values, (err, script) => {
        if (err) reject(err);
        else resolve(script);
      });
    });
  }

  async checkSchema() {
    const schema = `
    CREATE TABLE IF NOT EXISTS bank (
      bank_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      bank_name varchar(30),
      bank_interestRate decimal(5, 2),
      bank_maximumLoan decimal(19, 4),
      bank_minimumDownPayment decimal(5, 2),
      bank_loanTerm int unsigned
    )
    `;
    await this.createConnection();
    this.execQueryPromise(schema).catch((err) => console.error(err));
  }

  async getAllBanks() {
    let data = null;
    const query = `SELECT * FROM bank`;
    await this.execQueryPromise(query)
      .catch((err) => console.error(err))
      .then((rows) => (data = rows));
    return data;
  }

  async putBankInDB(bank) {
    let id = null;
    const query = `INSERT INTO bank(bank_name, bank_interestRate, bank_maximumLoan, bank_minimumDownPayment, bank_loanTerm)
                   VALUES(?, ?, ?, ?, ?)`;
    await this.execQueryPromise(query, [
      bank.name,
      bank.interestRate,
      bank.maximumLoan,
      bank.minimumDownPayment,
      bank.loanTerm,
    ])
      .catch((err) => console.error(err))
      .then((rows) => (id = rows.insertId));
    return id;
  }

  async deleteBankById(id) {
    let success = false;
    const query = `DELETE FROM bank WHERE bank.bank_id = ?`;
    await this.execQueryPromise(query, [id])
      .catch((err) => console.error(err))
      .then((rows) => (success = rows.affectedRows == 1 ? true : false));
    return success;
  }

  async updateBankInfo(data) {
    let update = null;
    const updateQuery =
      "UPDATE bank " +
      "SET bank.bank_name = ?, " +
      "bank.bank_interestRate = ?, " +
      "bank.bank_maximumLoan = ?, " +
      "bank.bank_minimumDownPayment = ?, " +
      "bank.bank_loanTerm = ? " +
      "WHERE bank.bank_id = ?";
    const selectQuery = `SELECT * FROM bank WHERE bank.bank_id = ?`;
    await this.execQueryPromise(updateQuery, [
      data.info.name,
      data.info.interestRate,
      data.info.maximumLoan,
      data.info.minimumDownPayment,
      data.info.loanTerm,
      data.id,
    ]).catch((err) => console.error(err));
    await this.execQueryPromise(selectQuery, [data.id])
      .catch((err) => console.error(err))
      .then((rows) => {
        console.log(rows);
        update = rows;
      });

    return update;
  }
}

const db = new Database(uri);

module.exports = db;
