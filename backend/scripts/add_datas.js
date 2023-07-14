const { ethers } = require('hardhat');

async function main() {
    let owner, manager;

    [owner, manager, player1] = await ethers.getSigners();
    const myContract = await ethers.getContractAt("PadelConnect", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Adding a manager
    await myContract.connect(owner).addManager(manager);
    const managerRegistered = await myContract.connect(manager).managers(manager);
    if(managerRegistered) {
        console.log("Un nouveau manager a été enregistré :", manager.address)
    }

    // Determining date of the tournament : now + 30s
    let dateInSecs = Math.floor(new Date().getTime() / 1000);
    dateInSecs = dateInSecs + 30;

    // Adding tournaments
    await myContract.connect(manager).addTournament('Rouen', dateInSecs, 0, 8);
    let tournoi = await myContract.connect(manager).tournaments(0);
    console.log("Tournoi enregistré à", tournoi.city)

    await myContract.connect(manager).addTournament('Caen', dateInSecs, 1, 16);
    tournoi = await myContract.connect(manager).tournaments(1);
    console.log("Tournoi enregistré à", tournoi.city)

    await myContract.connect(manager).addTournament('Paris', dateInSecs, 2, 16);
    tournoi = await myContract.connect(manager).tournaments(2);
    console.log("Tournoi enregistré à", tournoi.city)

    await myContract.connect(manager).addTournament('Rennes', dateInSecs, 3, 16);
    tournoi = await myContract.connect(manager).tournaments(3);
    console.log("Tournoi enregistré à", tournoi.city)

    await myContract.connect(manager).addTournament('Nantes', dateInSecs, 4, 16);
    tournoi = await myContract.connect(manager).tournaments(4);
    console.log("Tournoi enregistré à", tournoi.city)

    await myContract.connect(manager).addTournament('Strasbourg', dateInSecs, 5, 16);
    tournoi = await myContract.connect(manager).tournaments(5);
    console.log("Tournoi enregistré à", tournoi.city)

    // Adding a comment by a player
    await myContract.connect(player1).addComment(0, "Hello tout le monde !");
    const comment = await myContract.connect(player1).comments(0, 0);
    console.log("Message ajouté :", comment.message, "par :", comment.author);
}

main()
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })