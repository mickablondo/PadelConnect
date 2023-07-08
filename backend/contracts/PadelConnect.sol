// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./IPadelConnect.sol";

/// @title Padel tournament management contract
/// @notice This contract makes it possible to manage padel tournaments and to connect the different users.
/// @dev The owner adds tournament managers.
///      The tournament managers create tournaments.
///      The players register for tournaments. 
/// @author Mickaël Blondeau
contract PadelConnect is IPadelConnect, Ownable {

    /// @notice Map of a manager address to his description
    mapping(address => Manager) private managers;

    /// @notice Map of a manager address to a Tournament
    mapping(address => Tournament) tournamentsByManager;

    /// @notice Map of a player address to his description
    mapping(address => Player) private players;

    /// @notice Map of a player address to his following tournaments
    mapping(address => Tournament) followingTournamentsByPlayers;

    /// @notice Map of a tournamentId to the comments
    mapping(uint => Comment[]) comments;

    /// @notice Map of a tournament to a map of a player address to the private comments
    mapping(uint => mapping(address => Comment[])) private privateComments;

    // ------------------------ MODIFIERS -------------------------
    /**
     * @dev La personne qui interroge doit être dans la whitelist des managers
     */
    modifier onlyManagers() {
        require(managers[msg.sender].isRegistered, "Forbidden access, you're not a manager !");
        _;
    }

    // ------------------------ FONCTIONS -------------------------
    /**
     * @dev See {IPadelConnect-addManager}.
     */
    function addManager(address _address, bytes32 firstName, bytes32 lastName) external {}

    /**
     * @dev See {IPadelConnect-addTournament}.
     */
    function addTournament() external {}

    /**
     * @dev See {IPadelConnect-getTournament}.
     */
    function getTournament() external view returns(Tournament memory) {}

    /**
     * @dev See {IPadelConnect-registerPlayer}.
     */
    function registerPlayer() external {}

    /**
     * @dev See {IPadelConnect-addWinners}.
     */
    function addWinners() external {}

    /**
     * @dev See {IPadelConnect-addComment}.
     */
    function addComment() external {}

    /**
     * @dev See {IPadelConnect-addPrivateComment}.
     */
    function addPrivateComment() external {}
}