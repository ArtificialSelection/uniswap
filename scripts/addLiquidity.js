const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Prit: require("../artifacts/contracts/Prit.sol/Prit.json"),
  Patel: require("../artifacts/contracts/Patel.sol/Patel.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const {
  Pool,
  Position,
  nearestUsableTick,
  NonfungiblePositionManager,
} = require("@uniswap/v3-sdk");
const { ethers } = require("hardhat");

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };

  async function main() {
    const [owner, signer2] = await ethers.getSigners();
    const provider = waffle.provider;

    const PritContract = new Contract(
      pritAddress,
      artifacts.Prit.abi,
      provider
    );

    const PatelContract = new Contract(
      patelAddress,
      artifacts.Patel.abi,
      provider
    );

    await PritContract.connect(signer2).approve(
      positionManagerAddress,
      ethers.utils.parseEther("1000")
    );

    await PatelContract.connect(signer2).approve(
      positionManagerAddress,
      ethers.utils.parseEther("1000")
    );

    const poolContract = new Contract(
      Pri_Pa,
      artifacts.UniswapV3Pool.abi,
      provider
    );

    const poolData = await getPoolData(poolcontract);

    const PritToken = new Token(31337, pritAddress, 18, "Prit", "PriX");
    const PatelToken = new Token(31337, patelAddress, 18, "Patidar", "Patel");

    const pool = new Pool(
      PritToken,
      PatelToken,
      poolData.fee,
      poolData.sqrtPriceX96.toString(),
      poolData.liquidity.toString(),
      poolData.tick
    );

    const position = new Position({
      pool: pool,
      liquidity: ethers.utils.parseEther("1"),
      tickLower:
        nearestUsableTick(poolData.tick, poolData.tickSpacing) -
        poolData.tickSpacing * 2,
      tickUpper:
        nearestUsableTick(poolData.tick, poolData.tickSpacing) +
        poolData.tickSpacing * 2,
    });

    const { amount0: amount0Desired, amount1: amount1Desired } =
      position.mintAmounts;

    params = {
      token0: pritAddress,
      token1: patelAddress,
      fee: poolData.fee,
      tickLower:
        nearestUsableTick(poolData.tick, poolData.tickSpacing) -
        poolData.tickspacing * 2,
      amount0Desired: amount0Desired.toString(),
      amount1Desired: amount1Desired.toString(),
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer2.address,
      deadline: Mathfloor(Date.now() / 1000) + 60 * 10,
    };

    const nonfungiblePositionManager = new Contract(
      positionManagerAddress,
      artifacts.NonfungiblePositionManager.abi,
      provider
    );

    const tx = await nonfungiblePositionManager
      .connect(signer2)
      .mint(params, { gasLimit: "1000000" });
    const receipt = await tx.wait();
    console.log(receipt);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
