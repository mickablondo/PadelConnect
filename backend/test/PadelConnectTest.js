const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe("Test PadelConnect", function() {

    let pcContract, owner, manager, player1, player2, player3;

    beforeEach(async function() {
        [owner, manager, player1, player2, player3] = await ethers.getSigners();
        let contract = await ethers.getContractFactory("PadelConnect");
        pcContract = await contract.deploy()
    });

    describe("Initialization", function() {
        it('should deploy the smart contract', async function() {
            let theOwner = pcContract.owner();
            assert.equal(owner.address, theOwner);
        });
    });

    describe("Adding managers", function() {
        if('should add a new manager', async function() {
            // TODO
            assert.equal(true, true);
        });
    });

    describe("Adding tournaments", function() {
        beforeEach(async function() {
            // TODO : add manager
        });

        if('should add a new tournament', async function() {
            // TODO
            assert.equal(true, true);
        });
    });

    describe("Registering players", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament
        });

        if('should add a new player', async function() {
            // TODO
            assert.equal(true, true);
        });
    });

    describe("Adding winners", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / players
        });

        if('should add a new player', async function() {
            // TODO
            assert.equal(true, true);
        });
    });

    describe("Forum", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / many players
        });

        if('should add a new commment', async function() {
            // TODO
            assert.equal(true, true);
        });
    });

    describe("Private messages", function() {
        beforeEach(async function() {
            // TODO : add manager / tournament / many players
        });

        if('should add a new private commment', async function() {
            // TODO
            assert.equal(true, true);
        });
    });
});