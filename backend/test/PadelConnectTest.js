const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Test PadelConnect", function() {

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    let pcContract, owner, manager, player1, player2, player3;

    beforeEach(async function() {
        [owner, manager, player1, player2, player3] = await ethers.getSigners();
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
            await expect(pcContract.connect(owner).addManager(manager, 'john', 'doe'))
                .to.emit(
                    pcContract,
                    'ManagerAdded'
                ).withArgs(
                    manager.address
                );
        });

        it('should revert when caller is not the owner', async function() {
            await expectRevert(
                pcContract.connect(manager).addManager(manager, 'john', 'doe'),
                "Ownable: caller is not the owner"
            );
        });

        it('should revert when the manager address is the zero address', async function() {
            await expectRevert(
                pcContract.connect(owner).addManager(ZERO_ADDRESS, 'john', 'doe'),
                "Cannot be the zero address"
            );
        });

        it('should revert when the first name is empty', async function() {
            await expectRevert(
                pcContract.connect(owner).addManager(manager, '', 'doe'),
                "Field cannot be empty"
            );
        });

        it('should revert when the last name is empty', async function() {
            await expectRevert(
                pcContract.connect(owner).addManager(manager, 'john', ''),
                "Field cannot be empty"
            );
        });

        it('should revert when the address was ever registered', async function() {
            await pcContract.connect(owner).addManager(manager, 'john', 'doe');
            await expectRevert(
                pcContract.connect(owner).addManager(manager, 'john', 'doe'),
                "Already registered"
            );
        });
    });

    describe("Adding tournaments", function() {
        beforeEach(async function() {
            await pcContract.connect(owner).addManager(manager, 'john', 'doe');
        });

        it('should add a new tournament', async function() {
            await expect(pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 3, 16))
                .to.emit(
                    pcContract,
                    'TournamentCreated'
                ).withArgs(
                    'rouen',
                    2,
                    2067697299
                );
        });

        it('should revert when caller is not a manager', async function() {
            await expectRevert(
                pcContract.connect(player1).addTournament('rouen', 2, 2067697299, 3, 16),
                "Forbidden access"
            );  
        });

        it('should revert when the city is empty', async function() {
            await expectRevert(
                pcContract.connect(manager).addTournament('', 2, 2067697299, 3, 16),
                "Field cannot be empty"
            );
        });

        it('should revert when the price is 0', async function() {
            await expectRevert(
                pcContract.connect(manager).addTournament('rouen', 0, 2067697299, 3, 16),
                "Mandatory price"
            );
        });

        it('should revert when the date is in the past', async function() {
            await expectRevert(
                pcContract.connect(manager).addTournament('rouen', 2, 1067697299, 3, 16),
                "Date must be in the future"
            );
        });

        it('should revert when the number of players is odd', async function() {
            await expectRevert(
                pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 3, 15),
                "Padel is played by 2"
            );
        });

        it('should return the informations of a tournament with a difficulty p500', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 3, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.id).to.be.equal(new BN(0));
            expect(tournament.city).to.be.equal('rouen');
            expect(tournament.price).to.be.equal(new BN(2));
            expect(tournament.date).to.be.equal(new BN(2067697299));
            expect(tournament.difficulty).to.be.equal(new BN(3));
            expect(tournament.maxPlayers).to.be.equal(new BN(16));
            expect(tournament.registrationsAvailable).to.be.equal(tournament.maxPlayers);
        });

        it('should return the difficulty p25', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 0, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(0));
        });

        it('should return the difficulty p100', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 1, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(1));
        });

        it('should return the difficulty p250', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 2, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(2));
        });

        it('should return the difficulty p1000', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 4, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(4));
        });

        it('should return the difficulty p2000', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 5, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(5));
        });

        it('should return an unknown difficulty', async function() {
            await pcContract.connect(manager).addTournament('rouen', 2, 2067697299, 7, 16);
            let tournament = await pcContract.tournaments(0);
            expect(tournament.difficulty).to.be.equal(new BN(6));
        });
    });

    describe("Adding winners", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / players
        });

        it('should add the winners', async function() {
            // TODO
        });
    });

    describe("Forum", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / many players
        });

        it('should add a new commment', async function() {
            // TODO
        });
    });

    describe("Private messages", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / many players
        });

        it('should add a new private commment', async function() {
            // TODO
        });
    });

    describe("Registering players", function() {
        beforeEach(async function() {
            await pcContract.connect(owner).addManager(manager, 'john', 'doe');
            await pcContract.connect(manager).addTournament('rouen', 20000000000000, 2067697299, 3, 16);
        });

        it('should add a new player', async function() {
            let tournament = await pcContract.tournaments(0);
            const registrationsAvailable = tournament.registrationsAvailable;
            await pcContract.connect(player1).registerPlayer(0, 'roger', 'federer', {
                value: ethers.parseEther("0.00002")
            });
            tournament = await pcContract.tournaments(0);
            expect(tournament.registrationsAvailable).to.be.lt(registrationsAvailable);
        });

        it('should revert if the id does not exist', async function() {
            await expectRevert(
                pcContract.connect(player1).registerPlayer(1, 'roger', 'federer', {
                    value: ethers.parseEther("0.00002")
                }),
                "Wrong id sent"
            );
        });

        it('should revert when the first name is empty', async function() {
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0, '', 'federer', {
                    value: ethers.parseEther("0.00002")
                }),
                "Field cannot be empty"
            );
        });

        it('should revert when the last name is empty', async function() {
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0, 'roger', '', {
                    value: ethers.parseEther("0.00002")
                }),
                "Field cannot be empty"
            );
        });

        it('should revert when the tournament is complete', async function() {
            // TODO CompleteTournament()
        });

        it('should revert when the value sent is not the good one', async function() {
            // TODO WrongValueToPay
        });

        it('should revert when tournament is already started', async function() {
            await time.increaseTo(2087697299);
            await expectRevert(
                pcContract.connect(player1).registerPlayer(0, 'roger', 'federer', {
                    value: ethers.parseEther("0.00002")
                }),
                "RegistrationEnded"
            );
        });
    });
});