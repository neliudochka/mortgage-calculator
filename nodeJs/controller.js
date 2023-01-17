const fs = require("fs");
const { getResponseObject } = require("./middleware");
const db = require("./database");

const getAllBanks = async (req, res) => {
  const con = await db.createConnection();
  con.connect(async (err) => {
    if (err) throw err;
    const banks = await db.getAllBanks();
    const data = [];
    let i = 0;
    for (let bank of banks) {
      //rename
      const dataI = getResponseObject(bank);
      data.push(dataI);
      i++;
    }
    res.writeHead(200, { "Content-Type": `${mime["json"]}; charset=utf-8` });
    res.write(JSON.stringify(data));
    res.end();
    con.destroy();
  });
};

const createNewBank = async (req, res) => {
  const { url } = req;
  //console.log(req.method, url);
  let data = "";
  req.on("error", (err) => console.error(err));

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", async () => {
    const dataParsed = JSON.parse(data);
    let result = null;
    const con = await db.createConnection();
    con.connect(async (err) => {
      if (err) throw err;
      result = (await db.putBankInDB(dataParsed)).toString();
      res.writeHead(200, { "Content-Type": `${mime["txt"]}; charset=utf-8` });
      res.write(result);
      res.end();
      con.destroy();
    });
  });
};

const updateBankInfo = async (req, res) => {
  const { url } = req;
  console.log(req.method, url);
  let data = "";
  req.on("error", (err) => console.error(err));

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", async () => {
    const dataParsed = JSON.parse(data);
    let result = null;
    const con = await db.createConnection();
    con.connect(async (err) => {
      if (err) throw err;
      const ans = await db.updateBankInfo(dataParsed);
      const obj = db.getResponseObject(ans[0]);
      result = JSON.stringify(obj);
      res.writeHead(200, { "Content-Type": `${mime["txt"]}; charset=utf-8` });
      res.write(result);
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

const deleteBankById = async (req, res) => {
  let data = "";
  req.on("error", (err) => console.error(err));

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", async () => {
    const con = await db.createConnection();
    con.connect(async (err) => {
      if (err) throw err;
      const success = await db.deleteBankById(data);
      res.writeHead(200, { "Content-Type": `${mime["json"]}; charset=utf-8` });
      res.write(success.toString());
      res.end();
      con.destroy();
    });
  });
};

module.exports = {
  getAllBanks,
  staticController,
  deleteBankById,
  createNewBank,
  updateBankInfo,
};
