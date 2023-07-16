require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    goerli: {
      url: process.env.NEXT_GOERLI_RPC_URL,
      accounts: [`0x${process.env.NEXT_PK}`],
      chainId: 5
    },
    sepolia: {
      url: process.env.NEXT_SEPOLIA_RPC_URL,
      accounts: [`0x${process.env.NEXT_PK}`],
      chainId: 11155111
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20"
      }
    ]
  },
  paths: {
    artifacts: '../frontend/artifacts',
  },
};
