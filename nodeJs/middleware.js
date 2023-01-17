const getResponseObject = (bank) => {
  //Can be easily shortened
  const data = {};
  data.id = bank.bank_id;
  data.name = bank.bank_name;
  data.interestRate = bank.bank_interestRate;
  data.maximumLoan = bank.bank_maximumLoan;
  data.minimumDownPayment = bank.bank_minimumDownPayment;
  data.loanTerm = bank.bank_loanTerm;
  return data;
};

module.exports = { getResponseObject };
