'use strict';

const { web3, myTokenContract } = require('../../../web3');

module.exports = {
  list: async (query) => {
    const accounts = await web3.eth.getAccounts();

    return {
      accounts,
    };
  },

  get: async () => {

  },

  me: async () => {

  },
};
