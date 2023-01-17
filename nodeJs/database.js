"use strict";

const mysql = require("mysql2");
const dbLoginSettings = require("../config/dbLoginSettings.config.json");

class Database {
  constructor(loginSettings) {
    this.loginSettings = loginSettings;
    this.con = null;
    this.checkSchema();
  }

  async createConnection() {
    //Create connection once?
    this.con = await mysql.createConnection(this.loginSettings);
    return this.con;
  }

  execQueryPromise(query) {
    return new Promise((resolve, reject) => {
      this.con.query(query, (err, script) => {
        console.log("1 " + err + " " + this.con.state);
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
                   VALUES('${bank.name}', '${bank.interestRate}', '${bank.maximumLoan}', '${bank.minimumDownPayment}', '${bank.loanTerm}')`;
    await this.execQueryPromise(query)
      .catch((err) => console.error(err))
      .then((rows) => (id = rows.insertId));
    return id;
  }

  async deleteBankById(id) {
    let success = false;
    const query = `DELETE FROM bank WHERE bank.bank_id = ${id}`;
    await this.execQueryPromise(query)
      .catch((err) => console.error(err))
      .then((rows) => (success = rows.affectedRows == 1 ? true : false));
    return success;
  }

  async updateBankInfo(data) {
    let update = null;
    const updateQuery = `UPDATE bank
                   SET bank.bank_name = '${data.info.name}',
                       bank.bank_interestRate = '${data.info.interestRate}',
                       bank.bank_maximumLoan = '${data.info.maximumLoan}',
                       bank.bank_minimumDownPayment = '${data.info.minimumDownPayment}',
                       bank.bank_loanTerm = '${data.info.loanTerm}'
                   WHERE bank.bank_id = ${data.id}`;
    const selectQuery = `SELECT * FROM bank WHERE bank.bank_id = ${data.id}`;
    await this.execQueryPromise(updateQuery).catch((err) => console.error(err));
    await this.execQueryPromise(selectQuery)
      .catch((err) => console.error(err))
      .then((rows) => (update = rows));
    return update;
  }
}

const db = new Database(dbLoginSettings);

module.exports = db;
