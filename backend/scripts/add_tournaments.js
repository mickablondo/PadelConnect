const { ethers } = require('hardhat');

async function main() {
    let owner, manager;

    [owner, manager, player1] = await ethers.getSigners();
    const myContract = await ethers.getContractAt("PadelConnect", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Determining date of the tournament : now + 30s
    let dateInSecs = Math.floor(new Date().getTime() / 1000);
    dateInSecs = dateInSecs + 30;
    const futureDate = 1694702274; // 14/09/2023

    // Adding tournaments
    await myContract.connect(manager).addTournament('Pau', 1694702274, 4, 12);
    await myContract.connect(manager).addTournament('Saint Denis', dateInSecs, 3, 22);
}

main()
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })