import BanksStorage from './banksStorage.js';

export default class MortgageCalculatorClass {
  constructor() {
    this.updateBankDropdown();
    document.getElementById('calculate-button').addEventListener('click', () => this.calculate());
  }

  updateBankDropdown() {
    const banksStorage = new BanksStorage();
    banksStorage.setMortgageClass(this);
    banksStorage.getBanks();
  }

  drawOptions(banks) {
    this.banks = {};
    for (let bank of banks) {
      this.banks[bank.id] = bank;
    }
    const bankDropdown = document.getElementById('banks-dropdown');
    for (let bank of banks) {
      bankDropdown.innerHTML += `<option value=${bank.id}>${bank.name}</option>`;
    }
  }

  calculate() {
    this.hideWarningAndAnswer();
    const answer = document.getElementById('calculated-mortgage');
    const initialLoan = document.getElementById('initial-loan').value;
    const downPayment = document.getElementById('down-payment').value;
    const select = document.getElementById('banks-dropdown');
    const bankId = select.options[select.selectedIndex].value;
    const bank = this.banks[bankId];
    if (!this.validateOptions(downPayment, initialLoan, bank)) return;
    const bId = bank.interestRate/12;
    const x = Math.pow((bId + 1), bank.loanTerm);
    const mortgage = ((initialLoan - downPayment) * bId * x)/((x) - 1);
    answer.innerHTML = mortgage;
    answer.style.display = 'block';
  }

  validateOptions(downPayment, initialLoan, bank) {
    const warning = document.getElementById('warning');
    if (downPayment*100/initialLoan < bank.minimumDownPayment) {
      warning.innerHTML = `Down payment in this bank can't be less than ${bank.minimumDownPayment}%`;
      warning.style.display = 'block';
      return false;
    } else if (+(initialLoan) > +(bank.maximumLoan)) {
      warning.innerHTML = `Loan in this bank can't be more than ${bank.maximumLoan}`;
      warning.style.display = 'block';
      return false;
    } else if (initialLoan == 0) {
        warning.innerHTML = `Why would someone borrow 0 money <img src="https://img.icons8.com/emoji/30/000000/thinking-face.png"/>?`;
        warning.style.display = 'block';
        return false;
    } else if (+(initialLoan) <= 0 || +(downPayment) <= 0) {
      warning.innerHTML = `Values can't be less or equal 0`;
      warning.style.display = 'block';
      return false;
    } else if (+(downPayment) >= +(initialLoan)) {
      warning.innerHTML = `Down payment should not be more than initial loan`;
      warning.style.display = 'block';
      return false;
    }
    return true;
  }

  hideWarningAndAnswer() {
    document.getElementById('calculated-mortgage').style.display = 'none';
    document.getElementById('warning').style.display = 'none';
  }
}
