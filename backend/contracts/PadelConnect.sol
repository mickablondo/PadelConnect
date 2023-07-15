// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IPadelConnect.sol";
import "./PadelConnectNFT.sol";

// TODO revoir visibilité
// TODO mapping(uint => Tournament) : mieux que array, non ?

/// @title Padel tournament management contract
/// @notice This contract makes it possible to manage padel tournaments and to connect the different users.
/// @dev The owner adds tournament managers.
///      The tournament managers create tournaments.
///      The players register for tournaments. 
/// @author Mickaël Blondeau
contract PadelConnect is IPadelConnect, Ownable, PadelConnectNFT {

    /// @notice Map of a manager address to his description
    mapping(address => bool) public managers;

    /// @notice Map of a tournament id to a manager address
    mapping(uint => address) linkManagerTournament;

    /// @notice Array of the tournaments
    Tournament[] public tournaments;

    /// @notice Map of a player address to his description
    mapping(address => Player) players;

    /// @notice Map of a tournament id to the players registered
    mapping(uint => mapping(address => bool)) public playersRegistered;

    /// @notice Map of a tournament id to the addresses of his followers
    mapping(uint => mapping(address => bool)) public followedTournaments;

    /// @notice Map of a tournamentId to the comments
    mapping(uint => mapping(uint => Comment)) public comments;

    /// @notice Map of a tournamentId to the max commentId
    /// @dev Use it to know the number of comments by tournament
    mapping(uint => uint) public idComments;

    /// @notice Map of a tournament to a map of a player address to the private comments
    mapping(uint => mapping(address => Comment[])) privateComments; // TODO à revérifier

    /// @notice Map of an address to a timestamp
    mapping(address => uint) lastPostDate;

    /// @notice Custom error when payment failed.
    error ErrorDuringPayment();

    /// @notice Custom error when the tournament is complete.
    error CompleteTournament();

    /// @notice Custom error when the registration phase is finished
    error RegistrationEnded();

    /**
     * @dev Sender must be a manager registered
     */
    modifier onlyManagers() {
        require(managers[msg.sender], "Forbidden");
        _;
    }

    /**
     * @dev The id sent must exist.
     * @param _tournamentId id of the tournament
     */
    modifier shouldIdTournamentExists(uint _tournamentId) {
        require(_tournamentId < tournaments.length, "Wrong id sent");
        _;
    }

    /**
     * @dev The address must be not the zero address
     * @param _address the address to check
     */
    modifier notZeroAddress(address _address) {
         require(_address != address(0), "Cannot be the zero address");
         _;
    }

    /**
     * @dev The string must not be empty
     * @param _field the string to be checked
     */
    modifier notEmptyString(string memory _field) {
         require(bytes(_field).length > 0, "Cannot be empty");
         _;
    }

    /**
     * @dev Check the time between two comments
     * @param _address the address of the author
     */
    modifier waitUntilNewPost(address _address) {
        require(lastPostDate[msg.sender] < block.timestamp - 10, "Wait 10s");
        _;
    }

    /**
     * @dev See {IPadelConnect-addManager}.
     */
    function addManager(address _address) external onlyOwner notZeroAddress(_address) {
        require(!managers[_address], "Already registered");
        managers[_address] = true;
        emit ManagerAdded(_address);
    }

    /**
     * @dev See {IPadelConnect-addTournament}.
     */
    function addTournament(string calldata _city, uint _date, uint8 _diff,uint8 _maxPlayers) external onlyManagers notEmptyString(_city) {
        require(_date > block.timestamp, "Incorrect date");
        require(_maxPlayers > 0 && _maxPlayers % 2 == 0, "Played by 2");
        require(_diff <= uint(type(Difficulty).max), "Incorrect difficulty");

        uint id = tournaments.length;

        tournaments.push(
            Tournament(
                id,
                _city,
                _date,
                Difficulty(_diff),
                _maxPlayers,
                address(0),
                address(0)
            )
        );

        linkManagerTournament[id] = msg.sender;
        emit TournamentCreated(id);
    }

    /**
     * @dev See {IPadelConnect-registerPlayer}.
     */
    function registerPlayer(uint _id, string calldata _firstName, string calldata _lastName) external shouldIdTournamentExists(_id) notEmptyString(_firstName) notEmptyString(_lastName) {
        require(!playersRegistered[_id][msg.sender], "Already registered");
        Tournament memory tournament = tournaments[_id];

        if(tournament.date < block.timestamp) {
            revert RegistrationEnded();
        }

        if(tournament.registrationsAvailable == 0) {
            revert CompleteTournament();
        }

        players[msg.sender] = Player(_lastName, _firstName);
        playersRegistered[_id][msg.sender] = true;

        --tournament.registrationsAvailable;
        tournaments[_id].registrationsAvailable = tournament.registrationsAvailable;
    }

    /**
     * @dev See {IPadelConnect-addWinners}.
     */
    function addWinners(uint _id, address _winner1, address _winner2) external onlyManagers() shouldIdTournamentExists(_id) notZeroAddress(_winner1) notZeroAddress(_winner2) {
        require(_winner1 != _winner2, "Same address");
        require(playersRegistered[_id][_winner1] && playersRegistered[_id][_winner2], "Not registered");

        tournaments[_id].winner1 = _winner1;
        tournaments[_id].winner2 = _winner2;

        string memory city = tournaments[_id].city;

        Player memory tempPlayer = players[_winner1];
        MintReward(_winner1, _id, city, tempPlayer.firstName, tempPlayer.lastName);

        tempPlayer = players[_winner2];
        MintReward(_winner2, _id, city, tempPlayer.firstName, tempPlayer.lastName);
    }

    /**
     * @dev See {IPadelConnect-addComment}.
     */
    function addComment(uint _id, string calldata _message) external shouldIdTournamentExists(_id) notEmptyString(_message) waitUntilNewPost(msg.sender) {
        comments[_id][idComments[_id]] = Comment(_message, msg.sender);
        ++idComments[_id];
        lastPostDate[msg.sender] = block.timestamp;
        emit TournamentCommentAdded(_id);
    }

    /**
     * @dev See {IPadelConnect-shouldIdTournamentExists}.
     */
    function followTournament(uint _id) external shouldIdTournamentExists(_id) {
        followedTournaments[_id][msg.sender] = true;
    }

    /**
     * @dev See {IPadelConnect-addPrivateCommentToManager}.
     */
    function addPrivateCommentToManager(uint _id, string calldata _message) external shouldIdTournamentExists(_id) notEmptyString(_message) waitUntilNewPost(msg.sender) {
        privateComments[_id][msg.sender].push(Comment(_message, msg.sender));
        lastPostDate[msg.sender] = block.timestamp;
        emit PrivateCommentAdded(_id, msg.sender);
    }

    /**
     * @dev See {IPadelConnect-addPrivateResponseToPlayer}.
     */
    function addPrivateResponseToPlayer(uint _id, address _player, string calldata _message) external onlyManagers() shouldIdTournamentExists(_id) notZeroAddress(_player) notEmptyString(_message) waitUntilNewPost(msg.sender) {
        privateComments[_id][_player].push(Comment(_message, msg.sender));
        lastPostDate[msg.sender] = block.timestamp;
        emit PrivateResponseAdded(_id, _player);
    }
}
