const { ethers } = require('hardhat');

async function main() {
    let owner, manager;

    [owner, manager] = await ethers.getSigners();
    const myContract = await ethers.getContractAt("PadelConnect", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Determining date of the tournament : now + 30s
    let dateInSecs = Math.floor(new Date().getTime() / 1000);
    dateInSecs = dateInSecs + 30;

    // Adding new tournament
    await myContract.connect(manager).addTournament('Pau', dateInSecs, 0, 8);
    let tournoi = await myContract.connect(manager).tournaments(0);
    console.log("Tournoi enregistré à", tournoi.city);
}

main()
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })