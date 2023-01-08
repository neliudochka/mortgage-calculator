import Bank from './bank.js';

export default class BanksStorage {
  _routes = {
    'allBanks': () => this.onAllBanksLoaded(),
    'newBank': () => this.onNewBankResponse(),
    'updateBankInfo': () => this.onUpdateBankInfo(),
    'deleteBankById': () =>this.onDeleteBankById(),
  }

  constructor() {
    if (!BanksStorage._instance) {
      BanksStorage._instance = this;
      this.xhr = new XMLHttpRequest();
      this.getBanks();
      this.banks = {};
    }
    return BanksStorage._instance;
  }

  createBank(newBank = null) {
    let bank = null;
    if (newBank) bank = new Bank(newBank);
    else bank = new Bank();
    bank.addToBanksStorage(this);
    const banks = document.getElementById('banks');
    banks.appendChild(bank.bank);
    if(!newBank) bank.editBank(true);
    else {
      this.banks[bank.i] = bank;
      bank.addEditDeleteListeners();
    }
  }

  addBank(bank) {
    const data = JSON.stringify(bank.info);
    this.xhr.open('POST', '/newBank');
    this.awaitBank = bank;
    this.xhr.send(data);
  }

  getBanks() {
    this.xhr.open('GET', '/allBanks');
    this.xhr.responseType = 'json';
    this.xhr.onload = () => this.xhrOnLoad();
    this.xhr.send();
  }

  deleteBank(bankNumber) {
    this.awaitDeleteBank = this.banks[bankNumber];
    this.xhr.open('DELETE', '/deleteBankById');
    this.xhr.send(bankNumber);
  }

  xhrOnLoad() {
    const parts = this.xhr.responseURL.split('/');
    const xhrOnLoadFunc = this._routes[parts[parts.length - 1]];
    if (xhrOnLoadFunc) xhrOnLoadFunc();
  }

  onAllBanksLoaded() {
    const banks = Object.values(this.xhr.response);
    if(this.mc) this.mc.drawOptions(banks);
    else {
      for (let bank of banks) {
        this.createBank(bank);
      }
    } 
  }

  setMortgageClass(mc) {
    this.mc = mc;
  }

  onNewBankResponse() {
    const id = this.xhr.response;
    if (id) {
      this.awaitBank.i = id;
      this.banks[id] = this.awaitBank;
      this.awaitBank.save();
    } else this.awaitBank.RequestDeleteBank();
    this.awaitBank = null;
    
  }

  updateBankInfo(bankNumber) {
    const info = this.banks[bankNumber].getUpdatedInfo();
    this.awaitUpdateBank = this.banks[bankNumber];
    this.xhr.open('POST', '/updateBankInfo');
    this.xhr.send(JSON.stringify({info, id: bankNumber}));
  }

  onUpdateBankInfo() {
    const res = this.xhr.response;
    this.awaitUpdateBank.save(res);
    this.awaitUpdateBank = null;
  }

  onDeleteBankById() {
    const res = this.xhr.response;
    if (!res) return; 
    const bankNumber = this.awaitDeleteBank.i;
    this.awaitDeleteBank.deleteBank();
    delete this.banks[bankNumber];
    this.awaitDeleteBank = null;
  }

}
