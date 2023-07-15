const { ethers } = require('hardhat');

async function main() {
    let owner, manager;

    [owner, manager, player1, player2] = await ethers.getSigners();
    const myContract = await ethers.getContractAt("PadelConnect", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Registering players
    await myContract.connect(player1).registerPlayer(0, 'roger', 'federer');
    await myContract.connect(player2).registerPlayer(0, 'rafael', 'nadal');
}

main()
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })