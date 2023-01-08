export default class Bank {
  constructor(bankInfo) {
    this.bank = document.createElement('div');
    this.bank.classList.add('bank');
    this.i = null;
    if (bankInfo) {
      this.i = bankInfo.id;
      delete bankInfo.id;
      this.info = bankInfo;
    } else this.setDefaultValues();
    const info = this.info;
    this.bank.innerHTML = `<div>${info.name}</div>
                      <div>${info.interestRate}</div>
                      <div>${info.maximumLoan}</div>
                      <div>${info.minimumDownPayment}</div>
                      <div>${info.loanTerm}</div>
                      <div class="funcs-button-holder">
                        <img title="Edit" class="funcs-button" src="https://img.icons8.com/fluency-systems-regular/48/000000/edit--v2.png"/>
                        <img title="Delete" class="funcs-button" src="https://img.icons8.com/material-outlined/48/000000/trash--v1.png"/>
                      </div>
                      `;
  }

  setDefaultValues() {
    this.info = {};
    this.info.name = `Bank-Name`;
    this.info.interestRate = '001';
    this.info.maximumLoan = '100000';
    this.info.minimumDownPayment = '100';
    this.info.loanTerm = '356';
  }

  getBankInfo() {
    return this.info;
  }

  addEditDeleteListeners() {
    this.bank.children[5].children[0].addEventListener('click', () => this.editBank(false));
    this.bank.children[5].children[1].addEventListener('click', () => this.requestDeleteBank());
  }

  requestDeleteBank() {
    if (this.i) this.banksStorage.deleteBank(this.i);
    else this.deleteBank();
  }

  deleteBank() {
    this.bank.parentElement.removeChild(this.bank);
  }

  addToBanksStorage(banksStorage) {
    this.banksStorage = banksStorage;
  }

  editBank() {
    const bank = this.bank;
    const bankBackup = bank.innerHTML;
    const bankChildren = bank.children;
    for (let i = 0; i < 5; i++) {
      const text = bankChildren[i].innerText;
      let input = `<input type="text" value="${text}" maxlength="12">`
      if (i === 1 || i === 3) input = `<input placeholder="###.##" type="number" min=0 max=100 value="${text}">`;
      else if (i === 2) `<input type="number" min=0 value="${text}"/>`;
      bankChildren[i].innerHTML = input;
    }
    bankChildren[5].innerHTML = `<img title="Save" class="funcs-button" src="https://img.icons8.com/office/48/000000/checkmark--v1.png"/>
                                 <img title="Cancel changes" class="funcs-button" src="https://img.icons8.com/office/48/000000/delete-sign.png"/>`;
    bankChildren[5].children[0].addEventListener('click', () => this.saveInfo());
    bankChildren[5].children[1].addEventListener('click', () => {
      if (!this.i) this.deleteBank();
      else {
        bank.innerHTML = bankBackup;
        this.addEditDeleteListeners();
      }
    });
  }

  saveInfo() {
    if (!this.validateInfo()) return;
    if (!this.i) this.banksStorage.addBank(this);
    else this.banksStorage.updateBankInfo(this.i);
  }

  save(bankInfo = null) {
    if(!bankInfo) this.getUpdatedInfo();
    const bank = this.bank;
    const bankChildren = bank.children;
    const infoKeys = Object.keys(this.info);
    for (let i = 0; i < 5; i++) {
      bankChildren[i].style['background-color'] = 'rgb(221, 248, 248)';
      let value = null;
      if (bankInfo) value = bankInfo[infoKeys[i]];
      else value = this.updatedInfo[infoKeys[i]];
      bankChildren[i].innerHTML = value;
      this.info[infoKeys[i]] = value;
    }
    bankChildren[5].innerHTML = `<img title="Edit" class="funcs-button" src="https://img.icons8.com/fluency-systems-regular/48/000000/edit--v2.png"/>
                                 <img title="Delete" class="funcs-button" src="https://img.icons8.com/material-outlined/48/000000/trash--v1.png"/>`;
    this.addEditDeleteListeners();
    this.updatedInfo = null;
  }

  getUpdatedInfo() {
    const bank = this.bank;
    const bankChildren = bank.children;
    this.updatedInfo = {};
    const infoKeys = Object.keys(this.info);
    for (let i = 0; i < 5; i++) {
      const input = bankChildren[i].firstElementChild;
      const text = input.value;
      this.updatedInfo[infoKeys[i]] = text;
    }
    return this.updatedInfo;
  }

  validateInfo() {
    const bank = this.bank;
    const bankChildren = bank.children;
    for (let i = 0; i < 5; i++) {
      const input = bankChildren[i].firstElementChild;
      const text = input.value;
      const regex1 = new RegExp('[0-9]+');
      if (((i == 1 || i == 3 ) && (!regex1.test(text) || +(text) < 0 || +(text) > 100))
      || ((i == 2 || i == 4) && !regex1.test(text))) {
        bankChildren[i].style['background-color'] = '#FFC0C7';
        return false;
      }
    }
    return true;
  }
}
