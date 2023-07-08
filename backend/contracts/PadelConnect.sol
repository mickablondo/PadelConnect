// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
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

    /// @notice Map of a tournament id to a manager
    mapping(uint => Manager) linkManagerTournament;

    /// @notice Array of the tournaments
    Tournament[] tournaments;

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
    function addManager(address _address, bytes32 firstName, bytes32 lastName) onlyOwner external {}

    /**
     * @dev See {IPadelConnect-addTournament}.
     */
    function addTournament(bytes32 _city, uint _price, uint _date, uint8 _maxPlayers) onlyManagers() external {}

    /**
     * @dev See {IPadelConnect-getTournament}.
     */
    function getTournament(uint _id) external view returns(Tournament memory) {}

    /**
     * @dev See {IPadelConnect-registerPlayer}.
     */
    function registerPlayer(uint _id, bytes32 _firstName, bytes32 _lastName) payable external {}

    /**
     * @dev See {IPadelConnect-addWinners}.
     */
    function addWinners(uint _id, address _winner1, address _winner2) onlyOwner external {}

    /**
     * @dev See {IPadelConnect-addComment}.
     */
    function addComment(uint _id, address _author, string calldata _message) external {}

    /**
     * @dev See {IPadelConnect-addPrivateComment}.
     */
    function addPrivateComment(uint _id, address _author, string calldata _message) external {}
}