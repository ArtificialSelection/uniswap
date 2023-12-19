import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { Axios } from "axios";

import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithBooToken,
  connectingWithLifeToken,
  connectingWithSingleSwapToken,
  connectingWithIWETHToken,
  connectingWithDAIToken,
  connectingWithUserStorageContract,
} from "../Utils/appFeatures";

import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";
import { LifeTokenABI } from "./constants";

import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";
import { addLiquidityExternal } from "../Utils/addLiquidity";
import { getLiquidityData } from "@/Utils/checkLiquidity";
import { connectingWithPoolContract } from "../Utils/deployPool";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
  //useState
  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");

  const [tokenData, setTokenData] = useState([]);
  const [getAllLiquidity, setGetAllLiquidity] = useState([]);

  const [topTokensList, setTopTokensList] = useState([]);

  const addToken = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x930b218f3e63eE452c13561057a8d5E61367d5b7",
    "0x721d8077771ebf9b931733986d619aceea412a1c",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "0x3489745eff9525CCC3d8c648102FE2cf3485e228",
    "0x43b9Ef43D415e84aD9964567002d648b11747A8f",
    "0xFCa5Bb3732185AE6AaFC65aD8C9A4fBFf21DbaaD",
    "0x1bef49d3800f0530da0af83fd752cdfb71f90bcd",
    "0xad87e30bf4530212ed82911b7a8dfee1a7a06f1e",
    "0x9Fa3cE4169c2d6b68E9dE3Cf5b040Be439eD0125",
  ];

  //Fetch Data
  const fetchingData = async () => {
    try {
      //Get User Account
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);

      //create provider
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      //check balance
      const balance = await provider.getBalance(userAccount);
      const convertBal = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(convertBal);
      setEther(ethValue);

      //Get Network name
      const network = await provider.getNetwork();
      console.log(network);
      setNetworkConnect(network.name);

      //All token balance and data
      addToken.map(async (el, i) => {
        //Getting contract
        const contract = new ethers.Contract(el, ERC20, provider);
        ///Getting balance of token
        const userBalance = await contract.balanceOf(userAccount);
        const tokenLeft = BigNumber.from(userBalance).toString();
        const convertTokenBal = ethers.utils.formatEther(tokenLeft);
        //Get Name and symbol
        const symbol = await contract.symbol();
        const name = await contract.name();

        tokenData.push({
          name: name,
          symbol: symbol,
          tokenBalance: convertTokenBal,
          tokenAddress: el,
        });
        console.log(tokenData);

        //Get Liquidity
        const userStorageData = await connectingWithUserStorageContract();
        const userLiquidity = await userStorageData.getAllTransaction();
        console.log(userLiquidity);

        userLiquidity.map(async (el, i) => {
          const liquidityData = await getLiquidityData(
            el.poolAddress,
            el.tokenAddress0,
            el.tokenAddress1
          );
          getAllLiquidity.push(liquidityData);
          console.log(getAllLiquidity);
        });

        //   // weth Balance
        //   const wethContract = await connectingWithIWETHToken();
        //   const wethBal = await wethContract.balanceOf(userAccount);
        //   const wethToken = BigNumber.from(wethBal).toString();
        //   const convertwethTokenBal = ethers.utils.formatEther(wethToken);
        //   setWeth9(convertwethTokenBal);

        //   // Dai Balance
        //   const daiContract = await connectingWithDAIToken();
        //   const daiBal = await daiContract.balanceOf(userAccount);
        //   const daiToken = BigNumber.from(daiBal).toString();
        //   const convertdaiTokenBal = ethers.utils.formatEther(daiToken);
        //   setDai(convertdaiTokenBal);
      });

      console.log(dai, weth9);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(tokenData);
    fetchingData();
  }, []);

  //create and add liquidity
  const createLiquidityAndPool = async ({
    tokenAddress0,
    tokenAddress1,
    fee,
    tokenPrice1,
    tokenPrice2,
    slippage,
    deadline,
    tokenAmountOne,
    tokenAmountTwo,
  }) => {
    try {
      //create pool
      const createPool = await connectingWithPoolContract(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        { gasLimit: 500000 }
      );
      const poolAddress = createPool;
      //create liquidity
      const info = await addLiquidityExternal(
        tokenAddress0,
        tokenAddress1,
        poolAddress,
        fee,
        tokenAmountOne,
        tokenAmountTwo
      );
      console.log(info);

      //ADD data
      const userStorageData = await connectingWithUserStorageContract();

      const userLiquidity = await userStorageData.addToBlockchain(
        poolAddress,
        tokenAddress0,
        tokenAddress1
      );

      console.log(info);
    } catch (error) {
      console.log(error);
    }
  };

  //Single swap tokenn
  const singleSwapToken = async ({ token1, token2, swapAmount }) => {
    console.log(
      token1.tokenAddress.tokenAddress,
      token2.tokenAddress.tokenAddress,
      swapAmount
    );
    try {
      let singleSwapToken;
      let weth;
      let dai;

      singleSwapToken = await connectingWithSingleSwapToken();
      console.log(singleSwapToken);
      weth = await connectingWithIWETHToken();
      dai = await connectingWithDAIToken();

      const decimals0 = 18;
      const inputAmount = swapAmount;
      const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        decimals0
      );

      console.log(amountIn);

      await weth.deposit({ value: amountIn });
      await weth.approve(singleSwapToken.address, amountIn);

      //Swap
      const transaction = await singleSwapToken.swapExactInputSingle(
        token1.tokenAddress.tokenAddress,
        token2.tokenAddress.tokenAddress,
        amountIn,
        {
          gasLimit: 300000,
        }
      );

      await transaction.wait();
      console.log(transaction);

      const balance = await dai.balanceOf(account);
      const transferAmount = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(transferAmount);
      setDai(ethValue);
      console.log("Dai balance:", ethValue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SwapTokenContext.Provider
      value={{
        singleSwapToken,
        connectWallet,
        getPrice,
        swapUpdatePrice,
        getAllLiquidity,
        createLiquidityAndPool,
        account,
        weth9,
        dai,
        networkConnect,
        ether,
        tokenData,
        topTokensList,
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};
