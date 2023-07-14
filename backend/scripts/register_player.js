const { ethers } = require('hardhat');

async function main() {
    let owner, manager;

    [owner, manager, player1] = await ethers.getSigners();
    const myContract = await ethers.getContractAt("PadelConnect", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Registering player
    await myContract.connect(manager).registerPlayer(10, 'roger', 'federer');
}

main()
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })