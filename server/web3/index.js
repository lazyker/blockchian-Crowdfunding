'use strict';

const config = require('../config/environment');
const Web3 = require('web3');

const compiledMyTokenContract = require('../../build/contracts/MyToken');

const web3 = new Web3(new Web3.providers.HttpProvider(config.ethNetwork));
const MyTokenContract = new web3.eth.Contract(compiledMyTokenContract.abi, config.addressMyToken);

module.exports = {
  web3,
  myTokenContract: MyTokenContract,
};
