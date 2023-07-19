const { ethers } = require('hardhat');

/**
 * PRE REQUIS - add_datas.js
 */
async function main() {
    let owner, manager, player1, player2;

    [owner, manager, player1, player2] = await ethers.getSigners();
    const myContract = await ethers.getContractAt("PadelConnect", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Registering players
    await myContract.connect(player1).registerPlayer(0);
    await myContract.connect(player2).registerPlayer(0);

    // Adding comments
    await myContract.connect(manager).addComment(0, 'Bienvenue sur le tournoi');
    await myContract.connect(player2).addComment(0, 'Les matchs vont être serrés');
}

main()
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })