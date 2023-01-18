const fs = require("fs");
const db = require("./database");

const getAllBanks = async (req, res) => {
  const con = await db.createConnection();
  con.connect(async (err) => {
    if (err) throw err;
    const banks = await db.getAllBanks();
    const data = [];
    for (const bank of banks) {
      data.push(getResponseObject(bank));
    }
    res.writeHead(200, { "Content-Type": `${mime["json"]}; charset=utf-8` });
    res.write(JSON.stringify(data));
    res.end();
    con.destroy();
  });
};

const createNewBank = async (req, res) => {
  doSmthWithBank(req, res, (data) => db.putBankInDB(JSON.parse(data)));
};

const updateBankInfo = async (req, res) => {
  doSmthWithBank(req, res, async (data) => {
    const answ = await db.updateBankInfo(JSON.parse(data));
    const obj = getResponseObject(answ[0]);
    return JSON.stringify(obj);
  });
};

const deleteBankById = async (req, res) => {
  doSmthWithBank(req, res, (data) => db.deleteBankById(data));
};

const doSmthWithBank = async (req, res, fun) => {
  let data = "";
  req.on("error", (err) => console.error(err));

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", async () => {
    let result = null;
    const con = await db.createConnection();
    con.connect(async (err) => {
      if (err) throw err;
      result = await fun(data);
      res.writeHead(200, { "Content-Type": `${mime["json"]}; charset=utf-8` });
      res.write(result.toString());
      res.end();
      con.destroy();
    });
  });
};

const mime = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  png: "image/png",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  json: "text/plain",
  txt: "text/plain",
};

const staticController = (path) => (req, res) => {
  const [, extention] = path.split(".");
  const typeAns = mime[extention];
  fs.readFile("." + path, (err, data) => {
    if (err) {
      console.error("in handle request " + err);
    } else {
      res.writeHead(200, { "Content-Type": `${typeAns}; charset=utf-8` });
      res.write(data);
    }
    res.end();
  });
};

const getResponseObject = (bank) => {
  return {
    id: bank.bank_id,
    name: bank.bank_name,
    interestRate: bank.bank_interestRate,
    maximumLoan: bank.bank_maximumLoan,
    minimumDownPayment: bank.bank_minimumDownPayment,
    loanTerm: bank.bank_loanTerm,
  };
};

module.exports = {
  getAllBanks,
  staticController,
  deleteBankById,
  createNewBank,
  updateBankInfo,
};
