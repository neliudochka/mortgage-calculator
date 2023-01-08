import BanksStorage from './banksStorage.js';

document.addEventListener('DOMContentLoaded', () => {
  const addBankButton = document.getElementById('add-bank');
  const banksStorage = new BanksStorage();
  addBankButton.addEventListener('click', () => {
    banksStorage.createBank();
  });
});
