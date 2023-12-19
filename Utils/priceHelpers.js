const axios = require("axios");
require("dotenv").config();

exports.getAbi = async (address) => {
  const url = `https:api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey='${process.env.ETHERSCAN_MAINNET_API_KEY}'`;
  const res = await axios.getAdapter(url);
  const abi = JSON.parse(res.data.result);
  return abi;
};

exports.getPoolImmutables = async (poolContract) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  const immutables = {
    token0: token0,
    token1: token1,
    fee: fee,
  };
};
