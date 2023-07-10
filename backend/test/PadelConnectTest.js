const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

// TODO modifiers & require

describe("Test PadelConnect", function() {

    let pcContract, owner, manager, player1, player2, player3;

    beforeEach(async function() {
        [owner, manager, player1, player2, player3] = await ethers.getSigners();

        const Lib = await ethers.getContractFactory("LibraryDifficulty");
        const lib = await Lib.deploy();
        const libAddress = await lib.getAddress();

        const contract = await ethers.getContractFactory("PadelConnect", {
            libraries: {
                LibraryDifficulty: libAddress,
              },
        });
        pcContract = await contract.deploy();
    });

    describe("Initialization", function() {
        it('should deploy the smart contract', async function() {
            let theOwner = await pcContract.owner();
            assert.equal(owner.address, theOwner);
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
    });

    describe("Adding tournaments", function() {
        beforeEach(async function() {
            await pcContract.connect(owner).addManager(manager, 'john', 'doe');
        });

        it('should add a new tournament', async function() {
            await expect(pcContract.connect(manager).addTournament('rouen', 2, 1694354392, 3, 16))
                .to.emit(
                    pcContract,
                    'TournamentCreated'
                ).withArgs(
                    'rouen',
                    2,
                    1694354392
                );
        });
    });

    describe("Registering players", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament
        });

        it('should add a new player', async function() {
            // TODO
            assert.equal(true, true);
        });
    });

    describe("Adding winners", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / players
        });

        it('should add a new player', async function() {
            // TODO
            assert.equal(true, true);
        });
    });

    describe("Forum", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / many players
        });

        it('should add a new commment', async function() {
            // TODO
            assert.equal(true, true);
        });
    });

    describe("Private messages", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / many players
        });

        it('should add a new private commment', async function() {
            // TODO
            assert.equal(true, true);
        });
    });
});