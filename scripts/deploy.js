const hre = require("hardhat");

async function main() {
  // //ERC20 Boo Token
  // const BooToken = await hre.ethers.getContractFactory("BooToken");
  // const booToken = await BooToken.deploy();
  // await booToken.deployed();
  // console.log(`booToken deployed to ${booToken.address}`);

  // //ERC20 Life Token
  // const LifeToken = await hre.ethers.getContractFactory("LifeToken");
  // const lifeToken = await LifeToken.deploy();
  // await lifeToken.deployed();
  // console.log(`lifeToken deployed to ${lifeToken.address}`);

  //Single Swap Token
  const SingleSwapToken = await hre.ethers.getContractFactory(
    "SingleSwapToken"
  );
  const singleSwapToken = await SingleSwapToken.deploy();
  await singleSwapToken.deployed();
  console.log(`singleSwapToken deployed to ${singleSwapToken.address}`);

  //SwapMultiHop
  const SwapMultiHop = await hre.ethers.getContractFactory("SwapMultiHop");
  const swapMultiHop = await SwapMultiHop.deploy();
  await swapMultiHop.deployed();
  console.log(`swapMultiHop deployed to ${swapMultiHop.address}`);

  //Single Swap Token
  const UserStorageData = await hre.ethers.getContractFactory(
    "UserStorageData"
  );
  const userStorageData = await UserStorageData.deploy();
  await userStorageData.deployed();
  console.log(`userStorageData deployed to ${userStorageData.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
