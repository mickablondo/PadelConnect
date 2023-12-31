const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { setTimeout } = require('timers/promises');

describe("Test PadelConnect", function() {

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    let pcContract, owner, manager, player1, player2, player3, manager2;

    beforeEach(async function() {
        [owner, manager, player1, player2, player3, manager2] = await ethers.getSigners();
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
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 3, 16);
            const tournaments = await pcContract.connect(manager).getTournaments();
            expect(tournaments.length).to.be.equal(1);
        });

        it('should emit an event when adding a new tournament', async function() {
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

        it('should revert when caller to get the tournaments is not a manager', async function() {
            pcContract.connect(manager).addTournament('rouen', 2067697299, 3, 16)
            await expectRevert(
                pcContract.connect(player1).getTournaments(),
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
            expect(tournament.registrationsAvailable).to.be.equal(new BN(16));
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
            await pcContract.connect(owner).addManager(manager2);
            await pcContract.connect(manager).addTournament('rouen', 2067697299, 3, 16);
            await pcContract.connect(player1).registerPlayer(0);
            await pcContract.connect(player2).registerPlayer(0);
        });

        context("Followers", function() {
            it('should adding a follower to a tournament', async function() {
                await pcContract.connect(player1).followTournament(0, true);
                let followIt = await pcContract.followedTournaments(0, player1);
                expect(followIt).to.be.true;
            });

            it('should emit an event when adding a follower to a tournament', async function() {
                await expect(pcContract.connect(manager).followTournament(0, true))
                .to.emit(
                    pcContract,
                    'TournamentFollowed'
                ).withArgs(
                    0,
                    manager.address
                );
            });

            it('should deleting a follower to a tournament', async function() {
                await pcContract.connect(player1).followTournament(0, true);
                await pcContract.connect(player1).followTournament(0, false);
                let followIt = await pcContract.followedTournaments(0, player1);
                expect(followIt).to.be.false;
            });
            
            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(player1).followTournament(112, true),
                    "Wrong id sent"
                );
            });
        });

        context("Adding winners", function() {
            it('should add the winners', async function() {
                await pcContract.connect(manager).addWinners(0, player1, player2);
                let tournament = await pcContract.tournaments(0);
                expect(tournament.winner1).to.be.equal(player1.address);
                expect(tournament.winner2).to.be.equal(player2.address);
            });

            it('should revert when caller is not the good manager', async function() {
                await expectRevert(
                    pcContract.connect(manager2).addWinners(0, player1, player2),
                    "Not the manager"
                );
            });

            it('should revert if the two winners are the same person', async function() {
                await expectRevert(
                    pcContract.connect(manager).addWinners(0, player1, player1),
                    "Same address"
                );
            });

            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(manager).addWinners(12, player1, player1),
                    "Wrong id sent"
                );
            });

            it('should revert if winner1 is the 0 address', async function() {
                await expectRevert(
                    pcContract.connect(manager).addWinners(0, ZERO_ADDRESS, player2),
                    "Cannot be the zero address"
                );
            });

            it('should revert if winner2 is the 0 address', async function() {
                await expectRevert(
                    pcContract.connect(manager).addWinners(0, player1, ZERO_ADDRESS),
                    "Cannot be the zero address"
                );
            });

            it('should revert if a winner has been not registered', async function() {
                await expectRevert(
                    pcContract.connect(manager).addWinners(0, player1, player3),
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
                    "Wait 2s"
                );
            });

            it('should revert if message is empty', async function() {
                await expectRevert(
                    pcContract.connect(player3).addComment(0, ''),
                    "Cannot be empty"
                );
            });
        });
    
        context("Messages from a player to a manager", function() {
            it('should add a new message to a manager', async function() {
                await pcContract.connect(player1).addMessageToManager(0, "Hello manager");
                const exchanges = await pcContract.connect(player1).getExchanges(0);
                expect(exchanges[0]).to.be.equal(player1.address);
            });

            it('should not modify the exchanges array when adding two new messages to a manager', async function() {
                await pcContract.connect(player1).addMessageToManager(0, "Hello manager");
                await setTimeout(3000);
                await pcContract.connect(player1).addMessageToManager(0, "How are you ?");
                const exchanges = await pcContract.connect(player1).getExchanges(0);
                expect(exchanges.length).to.be.equal(1);
            });

            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(player1).addMessageToManager(112, "Hello manager"),
                    "Wrong id sent"
                );
            });

            it('should revert when player send many messages in a short time', async function() {
                pcContract.connect(player2).addMessageToManager(0, "Hello manager");
                await expectRevert(
                    pcContract.connect(player2).addMessageToManager(0, "How are you ?"),
                    "Wait 2s"
                );
            });

            it('should revert if message is empty', async function() {
                await expectRevert(
                    pcContract.connect(player3).addMessageToManager(0, ''),
                    "Cannot be empty"
                );
            });
        });

        context("Response to the messages by the manager", function() {
            it('should add a new response', async function() {
                await pcContract.connect(manager).addResponseToPlayer(0, player1, "Hello player");
                const comments = await pcContract.connect(manager).getMessagesManagerPlayer(0, player1);
                expect(comments.length).to.be.greaterThan(0);
            });

            it('should revert when caller is not a manager', async function() {
                await expectRevert(
                    pcContract.connect(manager2).addResponseToPlayer(0, player1, "Hello player"),
                    "Not the manager"
                );
            });

            it('should revert if id does not exist', async function() {
                await expectRevert(
                    pcContract.connect(manager).addResponseToPlayer(112, player1, "Hello player"),
                    "Wrong id sent"
                );
            });

            it('should revert when player send many messages in a short time', async function() {
                pcContract.connect(manager).addResponseToPlayer(0, player1, "Hello player");
                await expectRevert(
                    pcContract.connect(manager).addResponseToPlayer(0, player1, "Ready player one ?"),
                    "Wait 2s"
                );
            });

            it('should revert if message is empty', async function() {
                await expectRevert(
                    pcContract.connect(manager).addResponseToPlayer(0, player1, ''),
                    "Cannot be empty"
                );
            });

            it('should revert when player address is the zero address', async function() {
                await expectRevert(
                    pcContract.connect(manager).addResponseToPlayer(0, ZERO_ADDRESS, "Hello player"),
                    "Cannot be the zero address"
                );
            });

            it('should revert if id does not exist when getting messages', async function() {
                await expectRevert(
                    pcContract.connect(player1).getMessagesManagerPlayer(112, player1),
                    "Wrong id sent"
                );
            });

            it('should revert when player address is the zero address when getting messages', async function() {
                await expectRevert(
                    pcContract.connect(manager).getMessagesManagerPlayer(0, ZERO_ADDRESS),
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

        it('should decrease the number of registrations allowed when adding a new player', async function() {
            let tournament = await pcContract.tournaments(0);
            const registrationsAvailable = tournament.registrationsAvailable;
            await pcContract.connect(player1).registerPlayer(0);
            tournament = await pcContract.tournaments(0);
            expect(tournament.registrationsAvailable).to.be.lt(registrationsAvailable);
        });

        it('should add a new tournament for the player registered', async function() {
            const nbTournamentsBefore = await pcContract.connect(player1).getTournamentsByPlayer();
            await pcContract.connect(player1).registerPlayer(0);
            const nbTournamentsAfter = await pcContract.connect(player1).getTournamentsByPlayer();
            expect(nbTournamentsAfter.length).to.be.gt(nbTournamentsBefore.length);
        });

        it('should revert if the id does not exist', async function() {
            await expectRevert(
                pcContract.connect(player1).registerPlayer(5),
                "Wrong id sent"
            );
        });

        it('should revert when the player is already registered', async function() {
            pcContract.connect(player1).registerPlayer(0);
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0),
                "Already registered"
            );
        });

        it('should revert when the tournament is complete', async function() {
            await pcContract.connect(player1).registerPlayer(1);
            await pcContract.connect(player2).registerPlayer(1);
            await expectRevert(
                pcContract.connect(player3).registerPlayer(1),
                "CompleteTournament"
            );
        });

        it('should revert when tournament is already started', async function() {
            await time.increaseTo(2087697299);
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0),
                "RegistrationEnded"
            );
        });
    });
});