const {
  getAllBanks,
  staticController,
  createNewBank,
  updateBankInfo,
  deleteBankById,
} = require("./controller");

//Improve naming of routes!
const routes = {
  GET: {
    "/allBanks": getAllBanks,
    "/": staticController("/mortgageCalculator.html"),
    "/mortgageCalculator": staticController("/mortgageCalculator.html"),
    "/bankList": staticController("/public/html/bankList.html"),
    "/public/css/style.css": staticController("/public/css/style.css"),
    "/public/frontJs/banksStorage.js": staticController(
      "/public/frontJs/banksStorage.js"
    ),
    "/public/frontJs/bank.js": staticController("/public/frontJs/bank.js"),
    "/public/frontJs/bankList.js": staticController(
      "/public/frontJs/bankList.js"
    ),
    "/public/frontJs/mortgageCalculatorClass.js": staticController(
      "/public/frontJs/mortgageCalculatorClass.js"
    ),
    "/public/frontJs/mortgageCalculator.js": staticController(
      "/public/frontJs/mortgageCalculator.js"
    ),
  },
  POST: {
    "/newBank": createNewBank,
    //replace with same put request
    "/updateBankInfo": updateBankInfo,
  },
  DELETE: {
    "/deleteBankById": deleteBankById,
  },
};

const handleRequest = (req, res) => {
  const { method, url } = req;
  console.log(method, url, routes[method] && routes[method][url]);
  if (routes[method] && routes[method][url]) {
    const controller = routes[method][url];
    controller(req, res);
  } else {
    //Handling wrong path
    res.writeHead(404);
    res.write("Not found");
    res.end();
  }
};

module.exports = handleRequest;
