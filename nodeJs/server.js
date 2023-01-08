'use strict';

const http = require('http');
const fs = require('fs');
const { error } = require('console');

const mime = {
  'html': 'text/html',
  'js': 'text/javascript',
  'css': 'text/css',
  'png': 'image/png',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'json': 'text/plain',
  'txt': 'text/plain',
};

const routing = {
  '/':  '/mortgageCalculator.html',
  '/mortgageCalculator':  '/mortgageCalculator.html',
  '/bankList': '/public/html/bankList.html',
}

class Server {
  _dbRequests = {
    '/allBanks': (res) => this.getAllBanks(res),
  };

  _reqMethods = {
    'GET': (req, res) => this.handleGetRequest(req, res),
    'POST': (req, res) => this.handlePostRequest(req, res),
    'DELETE': (req, res) => this.handleDeleteRequest(req, res),
  }

  constructor(port, database) {
    this.database = database;
    this.server = http.createServer();
    this.server.listen(port, () => console.log(`Server listening on port ${port}...`));
    this.server.on('request', (req, res) => this.handleRequest(req, res));
  }

  handleRequest(req, res) {
    const reqMethod = this._reqMethods[req.method];
    if (reqMethod) reqMethod(req, res);
  }

  handleGetRequest(req, res) {
    let name = req.url;
    console.log(req.method, name);
    if (routing[name]) name = routing[name];
    if (this._dbRequests[name]) {
      this._dbRequests[name](res);
      return;
    }
    const extention = name.split('.')[1];
    const typeAns = mime[extention];
    fs.readFile('.' + name, (err, data) => {
      if (err) console.error('in handle request ' + err);
      else {
        res.writeHead(200, { 'Content-Type': `${typeAns}; charset=utf-8` });
        res.write(data);
      };
      res.end();
    });
  }

  handlePostRequest(req, res) {
    let name = req.url;
    console.log(req.method, name);
    let data = '';
    req.on('error', (err) => console.error(err));

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', async () => {
      const dataParsed = JSON.parse(data);
      let result = null;
      const con = await this.database.createConnection();
      con.connect(async (err) => {
        if (err) throw err;
        if (name === '/newBank') result = (await this.database.putBankInDB(dataParsed)).toString();
        else if(name === '/updateBankInfo') {
          const ans = await this.database.updateBankInfo(dataParsed);
          const obj = this.getResponseObject(ans[0]);
          result = JSON.stringify(obj);
        }
        res.writeHead(200, { 'Content-Type': `${mime['txt']}; charset=utf-8` });
        res.write(result);
        res.end();
        con.destroy();
      });
    });
  }

  getResponseObject(bank) {
    const data = {};
    data.id = bank.bank_id;
    data.name = bank.bank_name;
    data.interestRate = bank.bank_interestRate;
    data.maximumLoan = bank.bank_maximumLoan;
    data.minimumDownPayment = bank.bank_minimumDownPayment;
    data.loanTerm = bank.bank_loanTerm;
    return data;
  }

  async getAllBanks(res) {
    const con = await this.database.createConnection();
    con.connect(async (err) => {
      if (err) throw err;
      const banks = await this.database.getAllBanks();
      const data = [];
      let i = 0;
      for (let bank of banks) {
        const dataI = this.getResponseObject(bank);
        data.push(dataI);
        i++;
      }
      res.writeHead(200, { 'Content-Type': `${mime['json']}; charset=utf-8` });
      res.write(JSON.stringify(data));
      res.end();
      con.destroy();
    });
  }

  handleDeleteRequest(req, res) {
    if (req.url !== '/deleteBankById') return;
    console.log(req.method, req.url);
    let data = '';
    req.on('error', (err) => console.error(err));

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', async () => {
      const con = await this.database.createConnection();
      con.connect( async (err) => {
        if (err) throw err;
        const success = await this.database.deleteBankById(data);
        res.writeHead(200, { 'Content-Type': `${mime['json']}; charset=utf-8` });
        res.write(success.toString());
        res.end();
        con.destroy();
      });
    });
  }

}

module.exports = { Server };
