async function main() {
  const [owner] = await ethers.getSigners();

  Prit = await ethers.getContractFactory("Prit");
  prit = await Prit.deploy();

  Patel = await ethers.getContractFactory("Patel");
  patel = await Patel.deploy();

  PopUp = await ethers.getContractFactory("PopUp");
  popUp = await PopUp.deploy();

  console.log("pritAddress=", `'${prit.address}'`);
  console.log("patelAddress=", `'${patel.address}'`);
  console.log("popUpAddress=", `'${popUp.address}'`);
}

/*
  npx hardhat run --network localhost scripts/deployToken.js
  */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
