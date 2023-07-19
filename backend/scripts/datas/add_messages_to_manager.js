const { ethers } = require('hardhat');

/**
 * PRE REQUIS - add_datas.js
 */
async function main() {
    let owner, manager;

    [owner, manager, player1, player2, player3, player4] = await ethers.getSigners();
    const myContract = await ethers.getContractAt("PadelConnect", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Adding new messages
    await myContract.connect(player3).addMessageToManager(0, "Le tournoi est-il mixte ?");
    console.log("Message envoyé de", player3.address, 'vers', manager.address);
    await myContract.connect(player2).addMessageToManager(0, "Il commence à quelle heure le tournoi ?");
    console.log("Message envoyé de", player2.address, 'vers', manager.address);
    await myContract.connect(player4).addMessageToManager(1, "J'ai hâte que le tournoi commence.");
    console.log("Message envoyé de", player4.address, 'vers', manager.address);
}

main()
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })