const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Test PadelConnect", function() {

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    let pcContract, owner, manager, player1, player2, player3, player4;

    beforeEach(async function() {
        [owner, manager, player1, player2, player3, player4] = await ethers.getSigners();
        const contract = await ethers.getContractFactory("PadelConnect");
        pcContract = await contract.deploy();
    });

    describe("Initialization", function() {
        it('should deploy the smart contract', async function() {
            let theOwner = await pcContract.owner();
            expect(owner.address).to.be.equal(theOwner);
        });
    });

    describe("Adding managers", function() {
        it('should add a new manager', async function() {
            await expect(pcContract.connect(owner).addManager(manager))
                .to.emit(
                    pcContract,
                    'ManagerAdded'
                ).withArgs(
                    manager.address
                );
        });

        it('should revert when caller is not the owner', async function() {
            await expectRevert(
                pcContract.connect(manager).addManager(manager),
                "Ownable: caller is not the owner"
            );
        });

        it('should revert when the manager address is the zero address', async function() {
            await expectRevert(
                pcContract.connect(owner).addManager(ZERO_ADDRESS),
                "Cannot be the zero address"
            );
        });

        it('should revert when the address was ever registered', async function() {
            await pcContract.connect(owner).addManager(manager);
            await expectRevert(
                pcContract.connect(owner).addManager(manager),
                "Already registered"
            );
        });
    });

    describe("Adding tournaments", function() {
        beforeEach(async function() {
            await pcContract.connect(owner).addManager(manager);
        });

        it('should add a new tournament', async function() {
            await expect(pcContract.connect(manager).addTournament('rouen', 2067697299, 3, 16))
                .to.emit(
                    pcContract,
                    'TournamentCreated'
                ).withArgs(
                    0
                );
        });

        it('should revert when caller is not a manager', async function() {
            await expectRevert(
                pcContract.connect(player1).addTournament('rouen', 2067697299, 3, 16),
                "Forbidden"
            );  
        });

        it('should revert when the city is empty', async function() {
            await expectRevert(
                pcContract.connect(manager).addTournament('', 2067697299, 3, 16),
                "Cannot be empty"
            );
        });

        it('should revert when the date is in the past', async function() {
            await expectRevert(
                pcContract.connect(manager).addTournament('rouen', 1067697299, 3, 16),
                "Incorrect date"
            );
        });

        it('should revert when the number of players is odd', async function() {
            await expectRevert(
                pcContract.connect(manager).addTournament('rouen', 2067697299, 3, 15),
                "Played by 2"
            );
        });

        it('should return the informations of a tournament with a difficulty p500', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 3, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.id).to.be.equal(new BN(0));
            expect(tournament.city).to.be.equal('rouen');
            expect(tournament.date).to.be.equal(new BN(2067697299));
            expect(tournament.difficulty).to.be.equal(new BN(3));
            expect(tournament.maxPlayers).to.be.equal(new BN(16));
            expect(tournament.registrationsAvailable).to.be.equal(tournament.maxPlayers);
            expect(tournament.winner1).to.be.equal(ZERO_ADDRESS);
            expect(tournament.winner2).to.be.equal(ZERO_ADDRESS);
        });

        it('should return the difficulty p25', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 0, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(0));
        });

        it('should return the difficulty p100', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 1, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(1));
        });

        it('should return the difficulty p250', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 2, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(2));
        });

        it('should return the difficulty p1000', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 4, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(4));
        });

        it('should return the difficulty p2000', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 5, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(5));
        });

        it('should revert if the difficulty is unknown', async function() {
            await expectRevert(
                pcContract.connect(manager).addTournament('rouen', 2067697299, 7, 16),
                "Incorrect difficulty"
            );
        });
    });

    describe("After registrering players", function() {
        beforeEach(async function() {
            await pcContract.connect(owner).addManager(manager);
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 3, 16);
            await pcContract.connect(player1).registerPlayer(0, 'roger', 'federer');
            await pcContract.connect(player2).registerPlayer(0, 'rafael', 'nadal');
        });

        context("Followers", function() {
            it('should adding a follower to a tournament', async function() {
                await pcContract.connect(player1).followTournament(0);
                let followIt = await pcContract.followedTournaments(0, player1);
                expect(followIt).to.be.true;
            });
            
            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(player1).followTournament(112),
                    "Wrong id sent"
                );
            });
        });

        context("Adding winners", function() {
            it('should add the winners', async function() {
                await pcContract.connect(owner).addWinners(0, player1, player2);
                let tournament = await pcContract.tournaments(0);
                expect(tournament.winner1).to.be.equal(player1.address);
                expect(tournament.winner2).to.be.equal(player2.address);
            });

            it('should revert when caller is not the owner', async function() {
                await expectRevert(
                    pcContract.connect(manager).addWinners(0, player1, player2),
                    "Ownable: caller is not the owner"
                );
            });

            it('should revert if the two winners are the same person', async function() {
                await expectRevert(
                    pcContract.connect(owner).addWinners(0, player1, player1),
                    "Same address"
                );
            });

            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(owner).addWinners(12, player1, player1),
                    "Wrong id sent"
                );
            });

            it('should revert if winner1 is the 0 address', async function() {
                await expectRevert(
                    pcContract.connect(owner).addWinners(0, ZERO_ADDRESS, player2),
                    "Cannot be the zero address"
                );
            });

            it('should revert if winner2 is the 0 address', async function() {
                await expectRevert(
                    pcContract.connect(owner).addWinners(0, player1, ZERO_ADDRESS),
                    "Cannot be the zero address"
                );
            });

            it('should revert if a winner has been not registered', async function() {
                await expectRevert(
                    pcContract.connect(owner).addWinners(0, player1, player3),
                    "Not registered"
                );
            });
        });
    
        context("Forum", function() {
            it('should add a new commment', async function() {
                await expect(pcContract.connect(player1).addComment(0, "Hello everyone"))
                .to.emit(
                    pcContract,
                    'TournamentCommentAdded'
                ).withArgs(
                    0
                );
            });

            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(player1).addComment(112, "Hello everyone"),
                    "Wrong id sent"
                );
            });

            it('should revert when player send many messages in a short time', async function() {
                pcContract.connect(player2).addComment(0, "Hello everyone");
                await expectRevert(
                    pcContract.connect(player2).addComment(0, "How are you ?"),
                    "Wait 10s"
                );
            });

            it('should revert if message is empty', async function() {
                await expectRevert(
                    pcContract.connect(player3).addComment(0, ''),
                    "Cannot be empty"
                );
            });
        });
    
        context("Private messages from a player", function() {
            it('should add a new private commment', async function() {
                await expect(pcContract.connect(player1).addPrivateCommentToManager(0, "Hello manager"))
                .to.emit(
                    pcContract,
                    'PrivateCommentAdded'
                ).withArgs(
                    0,
                    player1.address
                );
            });

            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(player1).addPrivateCommentToManager(112, "Hello manager"),
                    "Wrong id sent"
                );
            });

            it('should revert when player send many messages in a short time', async function() {
                pcContract.connect(player2).addPrivateCommentToManager(0, "Hello manager");
                await expectRevert(
                    pcContract.connect(player2).addPrivateCommentToManager(0, "How are you ?"),
                    "Wait 10s"
                );
            });

            it('should revert if message is empty', async function() {
                await expectRevert(
                    pcContract.connect(player3).addPrivateCommentToManager(0, ''),
                    "Cannot be empty"
                );
            });
        });

        context("Response to the private messages by the manager", function() {
            it('should add a new private response', async function() {
                await expect(pcContract.connect(manager).addPrivateResponseToPlayer(0, player1, "Hello player"))
                .to.emit(
                    pcContract,
                    'PrivateResponseAdded'
                ).withArgs(
                    0,
                    player1.address
                );
            });

            it('should revert when caller is not a manager', async function() {
                await expectRevert(
                    pcContract.connect(player1).addPrivateResponseToPlayer(0, player1, "Hello player"),
                    "Forbidden"
                );
            });

            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(manager).addPrivateResponseToPlayer(112, player1, "Hello player"),
                    "Wrong id sent"
                );
            });

            it('should revert when player send many messages in a short time', async function() {
                pcContract.connect(manager).addPrivateResponseToPlayer(0, player1, "Hello player");
                await expectRevert(
                    pcContract.connect(manager).addPrivateResponseToPlayer(0, player1, "Ready player one ?"),
                    "Wait 10s"
                );
            });

            it('should revert if message is empty', async function() {
                await expectRevert(
                    pcContract.connect(manager).addPrivateResponseToPlayer(0, player1, ''),
                    "Cannot be empty"
                );
            });

            it('should revert when player address is the zero address', async function() {
                await expectRevert(
                    pcContract.connect(manager).addPrivateResponseToPlayer(0, ZERO_ADDRESS, "Hello player"),
                    "Cannot be the zero address"
                );
            });
        });
    });

    describe("Registering players", function() {
        beforeEach(async function() {
            await pcContract.connect(owner).addManager(manager);
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 3, 16);
            await pcContract.connect(manager).addTournament('caen', 2067697299, 1, 2);
        });

        it('should add a new player', async function() {
            let tournament = await pcContract.tournaments(0);
            const registrationsAvailable = tournament.registrationsAvailable;
            await pcContract.connect(player1).registerPlayer(0, 'roger', 'federer');
            tournament = await pcContract.tournaments(0);
            expect(tournament.registrationsAvailable).to.be.lt(registrationsAvailable);
        });

        it('should revert if the id does not exist', async function() {
            await expectRevert(
                pcContract.connect(player1).registerPlayer(5, 'roger', 'federer'),
                "Wrong id sent"
            );
        });

        it('should revert when the first name is empty', async function() {
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0, '', 'federer'),
                "Cannot be empty"
            );
        });

        it('should revert when the last name is empty', async function() {
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0, 'roger', ''),
                "Cannot be empty"
            );
        });

        it('should revert when the player is already registered', async function() {
            pcContract.connect(player1).registerPlayer(0, 'roger', 'federer');
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0, 'roger', 'federer'),
                "Already registered"
            );
        });

        it('should revert when the tournament is complete', async function() {
            await pcContract.connect(player1).registerPlayer(1, 'roger', 'federer');
            await pcContract.connect(player2).registerPlayer(1, 'rafael', 'nadal');
            await expectRevert(
                pcContract.connect(player3).registerPlayer(1, 'micka', 'blondo'),
                "CompleteTournament"
            );
        });

        it('should revert when tournament is already started', async function() {
            await time.increaseTo(2087697299);
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0, 'roger', 'federer'),
                "RegistrationEnded"
            );
        });
    });
});