const hre = require("hardhat");

async function main() {

  const padelconnect = await hre.ethers.deployContract("PadelConnect");

  await padelconnect.waitForDeployment();

  console.log(
    `padelconnect deployed to ${padelconnect.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});