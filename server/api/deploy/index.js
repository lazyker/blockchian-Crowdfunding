'use strict';

const express = require('express');
const router = express.Router([]);
const { web3 } = require('../../web3');

const deployContract = async (compiled) => {
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(compiled.abi)
    .deploy({ data: compiled.bytecode })
    .send({ from: accounts[0], gas: '2000000' });

  return result.options.address;
};

router.post('/', async (req, res) => {
  const myToken = await deployContract(require('../../../build/contracts/MyToken'));

  return res.status(200).json({
    myToken,
  });
});

module.exports = router;
