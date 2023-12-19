// Token addresses
pritAddress = "0x3489745eff9525CCC3d8c648102FE2cf3485e228";
patelAddress = "0x43b9Ef43D415e84aD9964567002d648b11747A8f";
popUpAddress = "0xFCa5Bb3732185AE6AaFC65aD8C9A4fBFf21DbaaD";
// Uniswap contract address
wethAddress = "0xCa57C1d3c2c35E667745448Fef8407dd25487ff8";
factoryAddress = "0xc3023a2c9f7B92d1dd19F488AF6Ee107a78Df9DB";
swapRouterAddress = "0x124dDf9BdD2DdaD012ef1D5bBd77c00F05C610DA";
nftDescriptorAddress = "0xe044814c9eD1e6442Af956a817c161192cBaE98F";
positionDescriptorAddress = "0xaB837301d12cDc4b97f1E910FC56C9179894d9cf";
positionManagerAddress = "0x4ff1f64683785E0460c24A4EF78D582C2488704f";

const UNISWAP_V3_FACTORY_ADDRESS = "0xc3023a2c9f7B92d1dd19F488AF6Ee107a78Df9DB";
const NON_FUNGIBLE_MANAGER = "0x4ff1f64683785E0460c24A4EF78D582C2488704f";

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

// const { waffle } = require("hardhat");
const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
const Web3Modal = require("web3modal");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const MAINNET_URL =
  "https://eth-mainnet.g.alchemy.com/v2/z0w7LrhuXpFH6e88BzepyNFbeq5pO0-M";
const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

function encodePriceSqrt(reserve1, reserve0) {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
}

const nonfungiblePositionManager = new Contract(
  positionManagerAddress,
  artifacts.NonfungiblePositionManager.abi,
  provider
);

const factory = new Contract(
  factoryAddress,
  artifacts.UniswapV3Factory.abi,
  provider
);

async function deployPool(token0, token1, fee, price) {
  // const [owner] = await ethers.getSigners();
  const MAINNET_URL = "test network url";

  const WALLET_ADDRESS = "your";
  const WALLET_SECRET = "your";
  const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);
  const wallet = new ethers.Wallet(WALLET_SECRET);
  const signer = wallet.connect(provider);
  const create = await nonfungiblePositionManager
    .connect(signer)
    .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
      gasLimit: 5000000,
    });

  console.log(create);
  const poolAddress = await factory
    .connect(signer)
    .getPool(token0, token1, fee);
  return poolAddress;
}

async function main() {
  const priPa = await deployPool(
    popUpAddress,
    patelAddress,
    3000,
    encodePriceSqrt(1, 1)
  );

  console.log("Pri_Pa=", `'${priPa}'`);
}

/*
  npx hardhat run --network goerli scripts/deployPool.js
  */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
